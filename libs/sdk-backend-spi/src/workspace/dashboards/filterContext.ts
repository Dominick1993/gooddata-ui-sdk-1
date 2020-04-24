// (C) 2019-2020 GoodData Corporation
import { ObjRef } from "@gooddata/sdk-model";
import { DateString, DateFilterGranularity } from "./extendedDateFilters";

/**
 * Date filter type - relative
 * @alpha
 */
export type RelativeType = "relative";

/**
 * Date filter type - absolute
 * @alpha
 */
export type AbsoluteType = "absolute";

/**
 * Date filter type - relative or absolute
 * @alpha
 */
export type DateFilterType = RelativeType | AbsoluteType;

/**
 * Attribute filter of the filter context
 * @alpha
 */
export interface IAttributeFilter {
    attributeFilter: {
        /**
         * Display form object ref
         */
        displayForm: ObjRef;

        /**
         * Is negative filter?
         */
        negativeSelection: boolean;

        /**
         * Selected attribute elements object refs
         */
        attributeElements: ObjRef[];
    };
}

/**
 * Date filter of the filter context
 * @alpha
 */
export interface IDateFilter {
    dateFilter: {
        /**
         * Date filter type - relative or absolute
         */
        type: DateFilterType;

        /**
         * Date filter granularity
         */
        granularity: DateFilterGranularity;

        /**
         * Filter - from
         */
        from?: DateString | number;

        /**
         * Filter - to
         */
        to?: DateString | number;

        /**
         * DateDataSet object ref
         */
        dataSet?: ObjRef;

        /**
         * Date attribute object ref
         */
        attribute?: ObjRef;
    };
}

/**
 * Supported filter context items
 * @alpha
 */
export type FilterContextItem = IAttributeFilter | IDateFilter;

/**
 * Filter context consists of configured attribute and date filters
 * (which could be applyied to the dashboard, widget alert, or scheduled email)
 *
 * @alpha
 */
export interface IFilterContextDefinition {
    /**
     * Filter context title
     */
    readonly title: string;

    /**
     * Filter context description
     */
    readonly description: string;

    /**
     * Attribute or date filters
     */
    readonly filters: FilterContextItem[];
}

/**
 * See {@link IFilterContextDefinition}
 * @alpha
 */
export type IFilterContext = IFilterContextDefinition & {
    readonly ref: ObjRef;
};