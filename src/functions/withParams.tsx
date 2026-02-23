import {useParams} from "react-router-dom";
import * as React from "react";

export function withParams<ParamsType extends Record<string, string>, P = object>(
    WrappedComponent: React.ComponentType<P & { params: ParamsType }>
) {
    const ComponentWithParams: React.FC<P> = (props) => {
        const params = useParams<ParamsType>() as ParamsType;
        return <WrappedComponent {...props} params={params} />;
    };
    return ComponentWithParams;
}