import { BaseCreationPage } from "./BaseCreationPage.tsx";
import type { FormSchema, FormState, FormOption } from "../../types/FormOption.ts";
import type { Category } from "../../types/ForumTypes.ts";

type TopicData = {
    title: string
    categoryId: string,
    content: string,
}

interface TopicCreationState extends FormState<TopicData> {
    categoryOptions: FormOption[]
}

export class TopicCreationPage extends BaseCreationPage<TopicData, FormSchema<TopicData>, any, TopicCreationState> {

    state: TopicCreationState = {
        loading: false,
        formData: {
            title: "",
            categoryId: "",
            content: "",
        },
        title: "Nova Tópico",
        categoryOptions: []
    }

    componentDidMount() {
        super.componentDidMount();
        this.fetchCategories();
    }

    private fetchCategories() {
        this.getFromApi<Category[]>("/forum/category/permitted").then(response => {
            if (response && response.data && response.data.success) {
                const options: FormOption[] = response.data.data.map((cat: Category) => ({
                    label: cat.title,
                    value: cat.id
                }));
                this.setState({ categoryOptions: options });
            }
        }).catch(err => {
            console.error("Failed to fetch permitted categories", err);
            // Ignore error or show toast. Form will just have empty select.
        });
    }

    protected getResourceName(): string {
        return "/forum/topic"
    }

    protected getFormSchema(): FormSchema<TopicData> {
        return {
            title: { type: "text", label: "Titulo" },
            categoryId: {
                type: "select",
                label: "Categoria",
                options: this.state.categoryOptions
            },
            content: { type: "textarea", label: "Conteúdo" },
        };
    }
}