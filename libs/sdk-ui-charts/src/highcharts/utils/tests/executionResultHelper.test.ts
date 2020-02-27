// (C) 2007-2020 GoodData Corporation

import { findAttributeInDimension, findMeasureGroupInDimensions } from "../executionResultHelper";
import { IAttributeDescriptor, IMeasureGroupDescriptor } from "@gooddata/sdk-backend-spi";
import { recordedDataView } from "@gooddata/sdk-backend-mockingbird";
import { ReferenceRecordings } from "@gooddata/reference-workspace";

const TestRecording = recordedDataView(
    ReferenceRecordings.Scenarios.BarChart.SingleMeasureWithViewByAndStackBy,
);

describe("findMeasureGroupInDimensions", () => {
    const sampleDimensions = TestRecording.dimensions();

    it("should return the measure group header", () => {
        const returnValue = findMeasureGroupInDimensions(sampleDimensions);
        const expectedValue = (sampleDimensions[1].headers[1] as IMeasureGroupDescriptor).measureGroupHeader;
        expect(returnValue).toBe(expectedValue);
    });

    it("should throw an error if measureGroup is not the last header on it's dimension", () => {
        const invalidDimensions = [
            {
                ...sampleDimensions[1],
                headers: [...sampleDimensions[1].headers, ...sampleDimensions[0].headers],
            },
        ];
        expect(findMeasureGroupInDimensions.bind(this, invalidDimensions)).toThrow();
    });
});

describe("findAttributeInDimension", () => {
    const dimensions = TestRecording.dimensions();
    const headerItems = TestRecording.allHeaders();
    it("should return the view by attribute header with header items", () => {
        const returnValue = findAttributeInDimension(dimensions[1], headerItems[1]);
        const expectedValue = {
            ...(dimensions[1].headers[0] as IAttributeDescriptor).attributeHeader,
            items: headerItems[1][0],
        };
        expect(returnValue).toEqual(expectedValue);
    });
    it("should return the stack by attribute header with header items", () => {
        const returnValue = findAttributeInDimension(dimensions[0], headerItems[0]);
        const expectedValue = {
            ...(dimensions[0].headers[0] as IAttributeDescriptor).attributeHeader,
            items: headerItems[0][0],
        };
        expect(returnValue).toEqual(expectedValue);
    });
});