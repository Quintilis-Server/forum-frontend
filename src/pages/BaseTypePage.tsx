import type { BaseProps, PageState } from "../types/PageTypes.ts";
import { BasePage } from "./BasePage.tsx";
import { BaseException } from "../exceptions/BaseException.ts";
import * as React from "react";

export type BaseTypeState<T> = PageState & {
    item: T
}

export abstract class BaseTypePage<T, P extends BaseProps, S extends BaseTypeState<T>> extends BasePage<P, S> {
    protected abstract getApiUrl(): string;
    protected abstract getPageTitle(item: T): string;
    protected abstract renderItem(item: T): React.ReactNode;

    public constructor(props: P) {
        super(props, { items: [], loading: true, title: "" } as unknown as S);
    }

    async componentDidMount() {
        super.componentDidMount();
        const result = await this.getFromApi<T>(this.getApiUrl())
        if (result === null || !result.data.success) {
            return this.setState({ err: BaseException.fromResponse(result.data) })
        }
        this.setState({
            title: this.getPageTitle(result.data.data),
            item: result.data.data
        });
    }

    protected renderContent(): React.ReactNode {
    let { item } = this.state
    return (
        <main className="main-home container">
            <div className={"title"}>
                <h1>{this.getPageTitle(item)}</h1>
                {/*<a className="new-button" href={this.getNewPath()}>{this.getNewLabel()}</a>*/}
            </div>

            <div className="list">
                {this.renderItem(item)}
            </div>
        </main>
    )}
}
