// (C) 2007-2018 GoodData Corporation
import React from "react";
import { CorePivotTableAgImpl } from "./CorePivotTable";
import {
    attributeLocalId,
    bucketAttributes,
    bucketIsEmpty,
    bucketsFind,
    bucketTotals,
    IBucket,
    IDimension,
    IExecutionDefinition,
    MeasureGroupIdentifier,
    newBucket,
} from "@gooddata/sdk-model";
import { ICorePivotTableProps, IPivotTableBucketProps, IPivotTableProps } from "./publicTypes";
import omit from "lodash/omit";
import {
    IntlTranslationsProvider,
    ITranslationsComponentProps,
    withContexts,
    Subtract,
    BucketNames,
    IntlWrapper,
} from "@gooddata/sdk-ui";
import { IPreparedExecution } from "@gooddata/sdk-backend-spi";
import invariant from "ts-invariant";

/**
 * Prepares new execution matching pivot table props.
 *
 * @param props - pivot table props
 * @returns new prepared execution
 */
function prepareExecution(props: IPivotTableProps): IPreparedExecution {
    const { backend, workspace, filters, sortBy = [] } = props;

    invariant(
        backend,
        "Backend was not provided in prepareExecution. Either pass it as a prop or use BackendContext.",
    );
    invariant(
        workspace,
        "Workspace was not provided in prepareExecution. Either pass it as a prop or use WorkspaceContext.",
    );

    return backend
        .workspace(workspace)
        .execution()
        .forBuckets(getBuckets(props), filters)
        .withDimensions(pivotDimensions)
        .withSorting(...sortBy);
}

function getBuckets(props: IPivotTableBucketProps): IBucket[] {
    const { measures = [], rows = [], columns = [], totals = [] } = props;

    return [
        newBucket(BucketNames.MEASURES, ...measures),
        // ATTRIBUTE for backwards compatibility with Table component. Actually ROWS
        newBucket(BucketNames.ATTRIBUTE, ...rows, ...totals),
        newBucket(BucketNames.COLUMNS, ...columns),
    ];
}

function pivotDimensions(def: IExecutionDefinition): IDimension[] {
    const { buckets } = def;
    const row = bucketsFind(buckets, BucketNames.ATTRIBUTE);
    const columns = bucketsFind(buckets, BucketNames.COLUMNS);
    const measures = bucketsFind(buckets, BucketNames.MEASURES);

    const rowAttributeIds = row ? bucketAttributes(row).map(attributeLocalId) : [];
    const columnAttributeIds = columns ? bucketAttributes(columns).map(attributeLocalId) : [];

    const measuresItemIdentifiers = measures && !bucketIsEmpty(measures) ? [MeasureGroupIdentifier] : [];

    const totals = row ? bucketTotals(row) : [];
    const totalsProp = totals.length ? { totals } : {};

    return [
        {
            itemIdentifiers: rowAttributeIds,
            ...totalsProp,
        },
        {
            itemIdentifiers: [...columnAttributeIds, ...measuresItemIdentifiers],
        },
    ];
}

type IPivotTableNonBucketProps = Subtract<IPivotTableProps, IPivotTableBucketProps>;

class RenderPivotTable extends React.Component<IPivotTableProps> {
    public render() {
        const { exportTitle } = this.props;

        const newProps: IPivotTableNonBucketProps = omit<IPivotTableProps, keyof IPivotTableBucketProps>(
            this.props,
            ["measures", "rows", "columns", "totals", "filters", "sortBy"],
        );

        const corePivotProps: Partial<ICorePivotTableProps> = omit(newProps, ["backend", "workspace"]);

        const execution = prepareExecution(this.props);

        return (
            <IntlWrapper locale={this.props.locale}>
                <IntlTranslationsProvider>
                    {(translationProps: ITranslationsComponentProps) => {
                        return (
                            <CorePivotTableAgImpl
                                {...corePivotProps}
                                intl={translationProps.intl}
                                execution={execution}
                                exportTitle={exportTitle || "PivotTable"}
                            />
                        );
                    }}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}

/**
 * Update link to documentation [PivotTable](https://sdk.gooddata.com/gooddata-ui/docs/next/pivot_table_component.html)
 * is a component with bucket props measures, rows, columns, totals, sortBy, filters
 *
 * @public
 */
export const PivotTable = withContexts(RenderPivotTable);
