import * as React from "react";
import "../stylesheet/ListComponentStyle.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {BaseComponent} from "./BaseComponent.tsx";
import type {PageResponse} from "../types/ApiResponseType.ts";

export type SortOption = {
    label: string;
    field: string;
}

export type ListComponentProps<T> = {
    apiUrl: string; // O componente agora sabe onde buscar os dados
    renderItem: (item: T) => React.ReactNode;
    getItemLink: (item: T) => string;
    getSearchableText: (item: T) => string;
    sortOptions?: SortOption[];
    getSortValue?: (item: T, field: string) => string | number;
    className?: string;
}

type ListState<T> = {
    items: T[];           // Itens vindos do servidor
    loading: boolean;
    currentPage: number;
    totalPages: number;
    searchQuery: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
}

export class ListComponent<T extends object> extends BaseComponent<ListComponentProps<T>, ListState<T>> {
    constructor(props: ListComponentProps<T>) {
        super(props);
        this.state = {
            items: [],
            loading: true,
            currentPage: 1,
            totalPages: 1,
            searchQuery: "",
            sortField: "",
            sortDirection: 'asc'
        } as ListState<T>;
    }

    async componentDidMount() {
        await this.fetchData(1);
    }

    private fetchData = async (page: number) =>{
        await this.executeAsync(async ()=>{
            const url = `${this.props.apiUrl}?page=${page}`
            const result = await this.get<PageResponse<T>>(url)
            if (result && result.data.success) {
                const page = result.data.data
                this.setState({
                    items: page.items,
                    totalPages: page.totalPages,
                    currentPage: page.currentPage
                })
            }
        })
    }

    private handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filtered = query.trim()
            ? this.state.items.filter(item =>
                this.props.getSearchableText(item).toLowerCase().includes(query.toLowerCase())
            )
            : [...this.state.items];

        this.setState({
            searchQuery: query,
            items: filtered,
        });
    }

    private handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const field = e.target.value;

        if (!field) {
            this.setState({ sortField: "" });
            return;
        }

        const { items, sortDirection } = this.state;
        const getSortValue = this.props.getSortValue ?? ((item: T, f: string) => (item as Record<string, any>)[f] ?? "");

        const sorted = [...items].sort((a, b) => {
            const aVal = getSortValue(a, field);
            const bVal = getSortValue(b, field);

            // Lógica de comparação genérica
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.setState({
            sortField: field,
            items: sorted,
        });
    }

    private toggleSortDirection = () => {
        const newDir = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        const sorted = [...this.state.items].reverse();

        this.setState({
            sortDirection: newDir,
            items: sorted,
        });
    }

    private handlePageChange = (page: number) => {
        this.setState({ currentPage: page });
        // Scroll para o topo da lista se desejar
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
        const { sortOptions = [], className } = this.props;
        // Pega tudo do STATE, pois o componente agora é autônomo
        const { items, searchQuery, sortField, sortDirection, currentPage, totalPages } = this.state;
        console.log(items)
        return (
            <div className="list-container">
                <div className="list-toolbar">
                    <div className="search-bar">
                        <FontAwesomeIcon className={"search-icon"} icon={faMagnifyingGlass}/>
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchQuery}
                            onChange={this.handleSearch}
                            className="search-input"
                        />
                    </div>

                    {sortOptions.length > 0 && (
                        <div className="sort-controls">
                            <select
                                value={sortField}
                                onChange={this.handleSort}
                                className="sort-select"
                            >
                                <option value="">Ordenar por...</option>
                                {sortOptions.map(opt => (
                                    <option key={opt.field} value={opt.field}>{opt.label}</option>
                                ))}
                            </select>
                            {sortField && (
                                <button className="sort-direction-btn" onClick={this.toggleSortDirection}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className={`list ${className}}`}>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <a href={this.props.getItemLink(item)} className="item-list" key={index}>
                                {this.props.renderItem(item)}
                            </a>
                        ))
                    ) : (
                        <div className="list-empty">
                            <p>Nenhum resultado encontrado.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={currentPage <= 1}
                            onClick={() => this.handlePageChange(currentPage - 1)}
                        >
                            ← Anterior
                        </button>

                        <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                                    onClick={() => this.handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            className="pagination-btn"
                            disabled={currentPage >= totalPages}
                            onClick={() => this.handlePageChange(currentPage + 1)}
                        >
                            Próxima →
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
