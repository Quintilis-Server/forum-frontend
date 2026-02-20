import {BaseAdminCreationPage} from "./BaseAdminCreationPage.tsx";
import type {FormSchema, FormState} from "../../types/FormOption.ts";
import type {PageState} from "../../types/PageTypes.ts";

type CategoryData = {
    title: string,
    slug: string,
    description: string,
    display_order: number
}

const CATEGORY_FORM_SCHEMA: FormSchema<CategoryData> = {
    title: {label: "Titulo", type: "text"},
    slug: {label: "Slug", type: "text"},
    description: {label: "Descrição", type: "textarea"},
    display_order: {label: "Ordem de mostragem", type: "number"}
}

export class CategoryCreationPage extends BaseAdminCreationPage<CategoryData, typeof CATEGORY_FORM_SCHEMA, object, FormState<CategoryData>> {
    protected getResourceName(): string {
        return "category";
    }

    protected getFormSchema(): typeof CATEGORY_FORM_SCHEMA {
        return CATEGORY_FORM_SCHEMA;
    }

    state: FormState<CategoryData> & PageState = {
        formData: {
            title: "",
            slug: "",
            description: "",
            display_order: 0
        },
        title: "Nova Categoria",
        err: undefined,
        loading: false
    }
}