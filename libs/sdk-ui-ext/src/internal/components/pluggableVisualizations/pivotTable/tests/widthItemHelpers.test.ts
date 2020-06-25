// (C) 2020 GoodData Corporation
import { IBucketItem } from "../../../../interfaces/Visualization";

import * as referencePointMocks from "../../../../tests/mocks/referencePointMocks";
import {
    invalidAttributeColumnWidthItem,
    invalidMeasureColumnWidthItem,
    invalidMeasureColumnWidthItemInvalidAttribute,
    invalidMeasureColumnWidthItemLocatorsTooShort,
    invalidMeasureColumnWidthItemTooManyLocators,
    validAttributeColumnWidthItem,
    validMeasureColumnWidthItem,
    validAllMeasureColumnWidthItem,
} from "./widthItemsMock";
import { adaptReferencePointWidthItemsToPivotTable } from "../widthItemsHelpers";
import { ColumnWidthItem } from "@gooddata/sdk-ui-pivot";

describe("adaptReferencePointWidthItemsToPivotTable", () => {
    const sourceReferencePoint = referencePointMocks.simpleStackedReferencePoint;

    const sourceColumnWidths: ColumnWidthItem[] = [
        invalidAttributeColumnWidthItem,
        invalidMeasureColumnWidthItem,
        invalidMeasureColumnWidthItemInvalidAttribute,
        invalidMeasureColumnWidthItemLocatorsTooShort,
        invalidMeasureColumnWidthItemTooManyLocators,
        validAttributeColumnWidthItem,
        validMeasureColumnWidthItem,
    ];

    const measures: IBucketItem[] = sourceReferencePoint.buckets[0].items;
    const rowAttributes: IBucketItem[] = sourceReferencePoint.buckets[1].items;
    const columnAttributes: IBucketItem[] = sourceReferencePoint.buckets[2].items;

    it("should remove invalid width items", async () => {
        const previousRowAttributes: IBucketItem[] = sourceReferencePoint.buckets[1].items;
        const previousColumnAttributes: IBucketItem[] = sourceReferencePoint.buckets[2].items;

        const expectedColumnWidthItems: ColumnWidthItem[] = [
            validAttributeColumnWidthItem,
            validMeasureColumnWidthItem,
        ];

        const result = adaptReferencePointWidthItemsToPivotTable(
            sourceColumnWidths,
            measures,
            rowAttributes,
            columnAttributes,
            previousRowAttributes,
            previousColumnAttributes,
            [],
        );

        expect(result).toEqual(expectedColumnWidthItems);
    });

    it("should remove invalid items and keep allMeasureColumnWidthItem", () => {
        const sourceColumnWidthsWithAllMeasure: ColumnWidthItem[] = [
            ...sourceColumnWidths,
            validAllMeasureColumnWidthItem,
        ];

        const previousRowAttributes: IBucketItem[] = sourceReferencePoint.buckets[1].items;
        const previousColumnAttributes: IBucketItem[] = sourceReferencePoint.buckets[2].items;

        const expectedColumnWidthItems: ColumnWidthItem[] = [
            validAttributeColumnWidthItem,
            validMeasureColumnWidthItem,
            validAllMeasureColumnWidthItem,
        ];

        const result = adaptReferencePointWidthItemsToPivotTable(
            sourceColumnWidthsWithAllMeasure,
            measures,
            rowAttributes,
            columnAttributes,
            previousRowAttributes,
            previousColumnAttributes,
            [],
        );

        expect(result).toEqual(expectedColumnWidthItems);
    });

    it("should keep allMeasureColumnWidthItem", () => {
        const sourceColumnWidthsWithAllMeasure: ColumnWidthItem[] = [validAllMeasureColumnWidthItem];

        const expectedColumnWidthItems: ColumnWidthItem[] = [validAllMeasureColumnWidthItem];

        const result = adaptReferencePointWidthItemsToPivotTable(
            sourceColumnWidthsWithAllMeasure,
            measures,
            [],
            [],
            [],
            [],
            [],
        );

        expect(result).toEqual(expectedColumnWidthItems);
    });
});
