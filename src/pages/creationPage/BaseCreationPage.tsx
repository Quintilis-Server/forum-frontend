import type { FormSchema, FormState } from "../../types/FormOption.ts";
import type { BaseProps } from "../../types/PageTypes.ts";
import { BaseFormPage } from "../BaseFormPage.tsx";
import { BaseException } from "../../exceptions/BaseException.ts";
import { type ApiResponseType, ErrorCode } from "../../types/ApiResponseType.ts";
import axios, { AxiosError } from "axios";

export abstract class BaseCreationPage<
    T extends object,
    F extends FormSchema<T>,
    P extends BaseProps = BaseProps,
    S extends FormState<T> = FormState<T>
> extends BaseFormPage<T, F, P, S> {

    // componentDidMount() {
    //     super.componentDidMount();
    // }

    protected abstract getResourceName(): string;

    protected async handleSubmit(): Promise<void> {
        const resource = this.getResourceName();
        try {
            this.setState(prevState => ({ ...prevState, loading: true }))

            const response = await this.postToApi(`${resource}/new`, this.state.formData);

            // if (!response) {
            //     throw new BaseException(ErrorCode.UNKNOWN_ERROR)
            // }

            if (!response.data.success) {
                throw new BaseException(response.data.errorCode, response.data.message)
            }

            alert("CRIADO COM SUCESSO")

            window.location.href = `/${resource}`
        } catch (e) {
            let err: BaseException = new BaseException(ErrorCode.UNKNOWN_ERROR);
            switch (e) {
                case e instanceof BaseException:
                    break
                case axios.isAxiosError(e):
                    err = BaseException.fromAxiosError(e as unknown as AxiosError<ApiResponseType<T>>)
                    break
                // default:
                //     err =
            }
            this.setState({
                err: err as BaseException
            } as unknown as Pick<S, "err">)
        } finally {
            this.setState(prevState => ({ ...prevState, loading: false }))
        }
    }
}