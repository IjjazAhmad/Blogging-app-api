const ROLE = {
    SUPERADMIN: "superAdmin",
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
};
const documentStatus = {
    PUBLISHED: "published",
    DRAFT: "draft",
    ARCHIVED: "archived",
    TRASHED: "trashed",
    PENDING: "pending",
    REJECTED: "rejected",
    APPROVED: "approved",
    PENDING_REVIEW: "pending_review",
    UPDATED: "updated",
    PUBLISHED_REVIEWED: "published_reviewed",
}
module.exports = {
    ROLE,
    documentStatus,
};