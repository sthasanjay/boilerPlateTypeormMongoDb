import {
    Between,
    ILike,
    In,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Not,
    SelectQueryBuilder,
    ObjectLiteral,
    IsNull,
    Brackets,
} from "typeorm";
import { AppDataSource } from "./data-source";
import assert from "assert";
import { ClassType } from "class-transformer-validator";
import { LIMIT } from "./globalConstants";
import moment from "moment";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

export interface FilterClauses {
    query: Record<string, any>;
    offset: number;
    limit: number;
    order: [string, "ASC" | "DESC"];
    attributes: string[];
    page: number;
}

export interface PaginatedContent<T> {
    data: T[];
    hasMore: boolean;
    count: number;
    totalCount: number;
    page: number;
}

class QueryFilterHelper<Entity extends ObjectLiteral> {
    public entity!: ClassType<Entity>;

    public async preQuery(
        queryString: Record<any, any>,
    ): Promise<Record<string, any>> {
        return queryString;
    }

    protected generateQueryFilter(
        queryParameters: Record<any, any>,
    ): Record<any, any> {
        Object.entries(queryParameters).forEach(([el, value]) => {
            if (typeof value === "string") queryParameters[el] = value.trim();
        });
        const query: Record<any, any> = {
            ...Object.fromEntries(
                Object.entries(queryParameters)
                    .filter(([el, _]) => !el.includes("__"))
                    .filter(
                        ([el, _]) =>
                            ![
                                "limit",
                                "page",
                                "offset",
                                "fields",
                                "ordering",
                                "order",
                                "attributes",
                                "order_by",
                            ].includes(el),
                    )
                    .map(([el, value]) => {
                        return [el, value === "NULL" ? IsNull() : value];
                    }),
            ),
        };
        Object.entries(queryParameters)
            .filter(([el, _]) => el.includes("__"))
            .forEach(([el, value]) => {
                const [column, operation] = el.split("__");
                switch (operation) {
                    case "substring":
                        query[column] = { $regex: value, $options: "i" };
                        break;
                    case "gt":
                        query[column] = { $gt: value };
                        break;
                    case "gte":
                        query[column] = { $gte: value };
                        break;
                    case "in":
                        query[column] = { $in: value };
                        break;
                    case "lt":
                        query[column] = { $lt: value };
                        break;
                    case "between": {
                        const dates = value.split(":");
                        query[column] = {
                            $gte: moment(
                                dates[0],
                                "DD-MM-YYYY HH:MM:SS",
                            ).toDate(),
                            $lt: moment(
                                dates[1],
                                "DD-MM-YYYY HH:MM:SS",
                            ).toDate(),
                        };
                        break;
                    }
                    case "lte":
                        query[column] = { $lte: value };
                        break;
                    case "ne":
                        query[column] = { $ne: value };
                        break;
                    default:
                        query[column] = value;
                }
            });
        return query;
    }

    protected prepareSqlClauses(queryString: Record<any, any>): FilterClauses {
        const query = this.generateQueryFilter(queryString);
        const limit = (+queryString.limit || LIMIT) + 1; // fetch extra row to see if there's more left
        const page = +queryString.page || 1;
        const offset = (+queryString.page - 1) * (limit - 1) || 0;
        const order: [string, "ASC" | "DESC"] = [
            queryString.order_by || "id",
            queryString.ordering || "DESC",
        ];
        const attributes: string[] = (
            queryString.fields ? queryString.fields.split(",") : []
        ).map((val: string) => val.trim());

        return {
            query,
            offset,
            limit,
            order,
            attributes,
            page,
        };
    }

    protected addRelations(
        builder: SelectQueryBuilder<Entity>,
        alias: string,
        withRelations?: string[],
    ): SelectQueryBuilder<Entity> {
        if (!withRelations) return builder;
        const relationFields = withRelations.filter(
            (column) =>
                !Object.keys(new this.entity().GenericFields ?? {}).includes(
                    column as string,
                ),
        ); // only get non generic fields
        const uniqueTablePrefixes = new Set(
            relationFields.map((str) => str.split(".")[0]),
        ); //get unique set of table names from relation fields

        const relationCategory = relationFields.reduce((acc, curr) => {
            const prefix = curr.split(".")[0];
            acc.set(prefix, (acc.get(prefix) || []).concat(curr));
            return acc;
        }, new Map()); // groupBy entityName/tableName prefix {"entityName": ["entityName.name","entityName.id"],"entityName1":...}
        // remove from map if value equals value in uniqueTablePrefixes
        for (const [key, value] of relationCategory.entries()) {
            if (uniqueTablePrefixes.has(value)) {
                relationCategory.delete(key);
            }
        }

        for (const table of uniqueTablePrefixes) {
            builder
                .leftJoin(alias + "." + table, table)
                .addSelect(relationCategory!.get(table));
        }
        return builder;
    }
}

export class QueryFilter<
    Entity extends ObjectLiteral,
> extends QueryFilterHelper<Entity> {
    public override entity!: ClassType<Entity>;

    private getCount(query: any) {
        return this.getQueryBuilder(query, "o").getCount();
    }

    public getQueryBuilder(
        queryString: Record<string, any>,
        alias: string,
    ): SelectQueryBuilder<Entity> {
        const { query } = this.prepareSqlClauses(queryString);
        return this._getQueryBuilder(query, alias);
    }

    protected _getQueryBuilder(
        query: Record<string, any>,
        alias: string,
    ): SelectQueryBuilder<Entity> {
        const repository = AppDataSource.getRepository(this.entity);

        return repository.createQueryBuilder(alias).where(query);
    }

    public getQueryBuilderForSummary(
        queryString: Record<string, any>,
        alias: string,
    ): SelectQueryBuilder<Entity> {
        const { query } = this.prepareSqlClauses(queryString);
        return this._getQueryBuilderForSummary(query, alias);
    }

    protected _getQueryBuilderForSummary(
        query: Record<string, any>,
        alias: string,
    ): SelectQueryBuilder<Entity> {
        const repository = AppDataSource.getRepository(this.entity);

        return repository.createQueryBuilder(alias).where(query);
    }

    public async paginate(
        queryString: Record<string, any>,
    ): Promise<PaginatedContent<Entity>> {
        const repository = AppDataSource.getRepository(this.entity);
        const { query, offset, limit, order, attributes, page } =
            this.prepareSqlClauses(queryString);
        const totalCount = await repository.count();
        const count = await repository.count({ where: query });

        const queryBuilder = repository
            .createQueryBuilder("entity")
            .where(query)
            .skip(offset)
            .take(limit)
            .orderBy(order[0], order[1]);

        if (attributes.length) {
            queryBuilder.select(attributes.map((attr) => `entity.${attr}`));
        }

        const data = await queryBuilder.getMany();
        return {
            data: data.slice(0, limit - 1),
            hasMore: data.length === limit,
            count: data.length,
            totalCount,
            page,
        };
    }
}
