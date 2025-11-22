export interface WorkspaceArticleUpdateResponseDto {
    _id: string;
    title: string;
    workspaceId: string;
    folderId: string;
}

export function toWorkspaceArticleUpdateResponseDto(article: any): WorkspaceArticleUpdateResponseDto {
    return {
        _id: article._id.toString(),
        title: article.title,
        workspaceId: article.workspaceId.toString(),
        folderId: article.folderId.toString(),
    };
}
