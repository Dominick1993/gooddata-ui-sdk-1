// (C) 2007-2018 GoodData Corporation
import React from "react";
import { ICoreChartProps, OnLegendReady } from "../../interfaces";
import { Visualization, getValidColorPalette } from "../../highcharts";
import { fixEmptyHeaderItems } from "@gooddata/sdk-ui-vis-commons";
import noop from "lodash/noop";
import { defaultCoreChartProps } from "../_commons/defaultProps";
import {
    newErrorMapping,
    IErrorDescriptors,
    ErrorCodes,
    ChartType,
    IErrorProps,
    ILoadingProps,
    IntlWrapper,
    IntlTranslationsProvider,
    ITranslationsComponentProps,
    ILoadingInjectedProps,
    withEntireDataView,
} from "@gooddata/sdk-ui";
import { getSanitizedStackingConfig } from "../_commons/sanitizeStacking";
import { ITheme } from "@gooddata/sdk-backend-spi";
import { ThemeContextProvider } from "@gooddata/sdk-ui-theme-provider";

/**
 * NOTE: exported to satisfy sdk-ui-ext; is internal, must not be used outside of SDK; will disapppear.
 *
 * @internal
 */
export interface IBaseChartProps extends ICoreChartProps {
    type: ChartType;
    visualizationComponent?: React.ComponentClass<any>; // for testing
    onLegendReady?: OnLegendReady;
    theme?: ITheme;
}

type Props = IBaseChartProps & ILoadingInjectedProps;

class StatelessBaseChart extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        ...defaultCoreChartProps,
        onDataTooLarge: noop,
        onLegendReady: noop,
        config: {},
        visualizationComponent: Visualization,
    };

    private readonly errorMap: IErrorDescriptors;

    constructor(props: Props) {
        super(props);

        this.errorMap = newErrorMapping(props.intl);
    }

    public render(): JSX.Element {
        const { dataView, error, isLoading } = this.props;

        const ErrorComponent = this.props.ErrorComponent as React.ComponentType<IErrorProps>;
        const LoadingComponent = this.props.LoadingComponent as React.ComponentType<ILoadingProps>;

        if (error) {
            const errorProps = this.errorMap[
                Object.prototype.hasOwnProperty.call(this.errorMap, error) ? error : ErrorCodes.UNKNOWN_ERROR
            ];
            return ErrorComponent ? <ErrorComponent code={error} {...errorProps} /> : null;
        }

        // when in pageble mode (getPage present) never show loading (its handled by the component)
        if (isLoading || !dataView) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return this.renderVisualization();
    }

    public renderVisualization(): JSX.Element {
        const {
            afterRender,
            height,
            locale,
            config,
            type,
            dataView,
            onDataTooLarge,
            pushData,
            theme,
        } = this.props;
        const colorPalette = getValidColorPalette(config);
        const fullConfig = { ...config, type, colorPalette };
        const sanitizedConfig = getSanitizedStackingConfig(dataView.definition, fullConfig);

        return (
            <ThemeContextProvider theme={theme} themeIsLoading={false}>
                <IntlWrapper locale={locale}>
                    <IntlTranslationsProvider>
                        {(translationProps: ITranslationsComponentProps) => {
                            // TODO: this is evil; mutating the items of readonly array; need to find a conceptual way to do this
                            fixEmptyHeaderItems(dataView, translationProps.emptyHeaderString);

                            return (
                                <this.props.visualizationComponent
                                    locale={locale}
                                    dataView={dataView}
                                    height={height}
                                    config={sanitizedConfig}
                                    numericSymbols={translationProps.numericSymbols}
                                    drillableItems={this.props.drillableItems}
                                    afterRender={afterRender}
                                    onDataTooLarge={onDataTooLarge}
                                    onNegativeValues={this.props.onNegativeValues}
                                    onDrill={this.props.onDrill}
                                    onLegendReady={this.props.onLegendReady}
                                    pushData={pushData}
                                />
                            );
                        }}
                    </IntlTranslationsProvider>
                </IntlWrapper>
            </ThemeContextProvider>
        );
    }
}

/**
 * NOTE: exported to satisfy sdk-ui-ext; is internal, must not be used outside of SDK; will disappear.
 *
 * @internal
 */
export const BaseChart = withEntireDataView(StatelessBaseChart);
