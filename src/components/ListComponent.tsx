import * as React from "react";
import "../stylesheet/ListComponentStyle.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export type SortOption = {
    label: string;
    field: string;
}

export type ListComponentProps<T> = {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    getItemLink: (item: T) => string;
    getSearchableText: (item: T) => string;
    sortOptions?: SortOption[];
    getSortValue?: (item: T, field: string) => string | number;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

type ListState<T> = {
    filteredItems: T[];
    searchQuery: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
}

export class ListComponent<T extends object> extends React.PureComponent<ListComponentProps<T>, ListState<T>> {
    state: ListState<T> = {
        filteredItems: this.props.items,
        searchQuery: "",
        sortField: "",
        sortDirection: 'asc',
    }

    componentDidUpdate(prevProps: ListComponentProps<T>) {
        if (prevProps.items !== this.props.items) {
            const { searchQuery, sortField, sortDirection } = this.state;
            let items = [...this.props.items];

            if (searchQuery.trim()) {
                items = items.filter(item =>
                    this.props.getSearchableText(item).toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (sortField) {
                const getSortValue = this.props.getSortValue ?? ((item: T, field: string) => (item as Record<string, any>)[field] ?? "");
                items.sort((a, b) => {
                    const aVal = getSortValue(a, sortField);
                    const bVal = getSortValue(b, sortField);
                    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    return sortDirection === 'asc' ? cmp : -cmp;
                });
            }

            this.setState({ filteredItems: items });
        }
    }

    private handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filtered = query.trim()
            ? this.props.items.filter(item =>
                this.props.getSearchableText(item).toLowerCase().includes(query.toLowerCase())
            )
            : [...this.props.items];

        this.setState({
            searchQuery: query,
            filteredItems: filtered,
        });
    }

    private handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const field = e.target.value;
        if (!field) {
            this.setState({
                sortField: "",
                filteredItems: this.state.searchQuery
                    ? this.state.filteredItems
                    : [...this.props.items]
            });
            return;
        }

        const getSortValue = this.props.getSortValue ?? ((item: T, f: string) => (item as Record<string, any>)[f] ?? "");
        const sorted = [...this.state.filteredItems].sort((a, b) => {
            const aVal = getSortValue(a, field);
            const bVal = getSortValue(b, field);
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return this.state.sortDirection === 'asc' ? cmp : -cmp;
        });

        this.setState({
            sortField: field,
            filteredItems: sorted,
        });
    }

    private toggleSortDirection = () => {
        const newDir = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        const sorted = [...this.state.filteredItems].reverse();

        this.setState({
            sortDirection: newDir,
            filteredItems: sorted,
        });
    }

    render() {
        const { sortOptions = [], currentPage = 1, totalPages = 1, onPageChange } = this.props;
        const { filteredItems, searchQuery, sortField, sortDirection } = this.state;

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

                <div className="list">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
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

                {totalPages > 1 && onPageChange && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            ← Anterior
                        </button>

                        <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            className="pagination-btn"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            Próxima →
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
