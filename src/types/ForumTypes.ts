import type {UserSummaryDTO} from "./User.ts";

export interface Category {
    id: string
    title: string
    slug: string
    description: string
    display_order: number
    created_at: Date
    topics: Topic[]
}
export interface Topic {
    id: string
    title: string
    slug: string
    content: string
    views: number
    createdAt: string
    author: UserSummaryDTO
}

export interface Post {

}
