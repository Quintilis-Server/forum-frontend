import { BaseTypePage, type BaseTypeState } from "../BaseTypePage.tsx";
import type { Category, Topic } from "../../types/ForumTypes.ts";
import { withParams } from "../../functions/withParams.tsx";
import * as React from "react";
import { ListComponent } from "../../components/ListComponent.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type Params = {
    id: string
}

type Props = {
    params: Params
}

class CategoryTypePage extends BaseTypePage<Category, Props, BaseTypeState<Category>> {
    protected getApiUrl(): string {
        return `/forum/category/${this.props.params.id}`
    }
    protected getPageTitle(item: Category): string {
        console.log(item)
        return item.title
    }
    protected renderItem(item: Category): React.ReactNode {
        return (
            <>
                <div className="row">
                    <p>{item.description}</p>
                    <a href="/topic/new" className="new-button">Criar <FontAwesomeIcon icon={faPlus} /></a>
                </div>
                <ListComponent<Topic>
                    renderItem={(topic) => (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <div>
                                <h3 style={{margin: '0 0 5px 0'}}>{topic.title}</h3>
                                <span style={{fontSize: '0.9em', color: '#666'}}>Autor: {topic.author.username}</span>
                            </div>
                            {topic.author.roles && topic.author.roles.length > 0 && (
                                <span
                                    className="role-badge"
                                    style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '0.8em',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {topic.author.roles[0].replace('ROLE_', '')}
                                </span>
                            )}
                        </div>
                    )}
                    getItemLink={(topic) => `/topic/${topic.id}`}
                    getSearchableText={(topic) => topic.title}
                    apiUrl={""}
                />
            </>
        )
    }

}

export default withParams<Params, object>(CategoryTypePage)