import {BaseComponent} from "./BaseComponent.tsx";
import {Component} from "react";

class InnerCategoryComponent extends Component {
    render() {
        return (
            <div></div>
        );
    }
}
export class CategoryComponent extends BaseComponent{
    render() {
        return(
            <section>
                <InnerCategoryComponent/>
            </section>
        )
    }
}