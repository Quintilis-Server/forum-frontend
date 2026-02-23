import {BaseTypePage, type BaseTypeState} from "../BaseTypePage.tsx";
import type {Category, Topic} from "../../types/ForumTypes.ts";
import {withParams} from "../../functions/withParams.tsx";
import * as React from "react";
import {ListComponent} from "../../components/ListComponent.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type Params = {
    slug: string
}

type Props = {
    params: Params
}

class CategoryTypePage extends BaseTypePage<Category, Props,  BaseTypeState<Category>>{
    protected getApiUrl(): string {
        return `/forum/category/${this.props.params.slug}`
    }
    protected getPageTitle(item: Category): string {
        return item.title
    }
    protected renderItem(item: Category): React.ReactNode {
        return (
            <>
                <div className="row">
                    <p>{item.description}</p>
                    <a href="/topic/new" className="new-button">Criar <FontAwesomeIcon icon={faPlus}/></a>
                </div>
                <ListComponent<Topic>
                    items={item.topics}
                    renderItem={(topic) => (
                        <div>
                            <h3>{topic.topic_id}</h3>
                            <span>Autor: {topic.author_id}</span>
                        </div>
                    )}
                    getItemLink={(topic) => `/topic/${topic.topic_id}`}
                    getSearchableText={(topic) => topic.topic_id}
                />
            </>
        )
    }

}

export default withParams<Params, object>(CategoryTypePage)