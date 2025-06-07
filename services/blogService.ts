import prisma from "@/prisma/client";
import { BlogEntry, UserCommented, User, Prisma } from "@prisma/client";

type BlogWithRelations = BlogEntry & {
  author: User;
  comments: (UserCommented & {
    user: User;
    likes: {
      userId: string;
      commentId: string;
    }[];
  })[];
  _count?: {
    comments?: number;
    likes?: number;
    views?: number;
  };
};

type BlogFilters = {
  search?: string;
  author?: string;
  sort?: string;
};

type BlogQueryOptions = {
  where?: Prisma.BlogEntryWhereInput;
  orderBy?: Prisma.BlogEntryOrderByWithRelationInput;
};

type SortOption =
  | "title-asc"
  | "title-desc"
  | "dateAdded-desc"
  | "dateAdded-asc"
  | "comments-desc"
  | "views-desc";

export class BlogService {
  static async buildWhereClause(
    filters: BlogFilters
  ): Promise<BlogQueryOptions["where"]> {
    const { search, author } = filters;
    const whereClause: BlogQueryOptions["where"] = {};

    if (author && author !== "all") {
      whereClause.userId = author;
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      whereClause.OR = [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    return whereClause;
  }

  static buildOrderByClause(sortOption?: string): BlogQueryOptions["orderBy"] {
    if (!sortOption) {
      return { createdAt: "desc" };
    }

    switch (sortOption as SortOption) {
      case "title-asc":
        return { title: "asc" };
      case "title-desc":
        return { title: "desc" };
      case "dateAdded-desc":
        return { createdAt: "desc" };
      case "dateAdded-asc":
        return { createdAt: "asc" };
      case "comments-desc":
        return { comments: { _count: "desc" } };
      case "views-desc":
        return { views: { _count: "desc" } };
      default:
        return { createdAt: "desc" };
    }
  }

  static async getBlogs(filters: BlogFilters): Promise<BlogWithRelations[]> {
    try {
      const { sort } = filters;
      const whereClause = await this.buildWhereClause(filters);
      const orderBy = this.buildOrderByClause(sort);

      const blogs = await prisma.blogEntry.findMany({
        where: whereClause,
        orderBy,
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
            },
          },
        },
      });

      return blogs;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBlogById(id: string): Promise<BlogWithRelations | null> {
    try {
      const blog = await prisma.blogEntry.findUnique({
        where: { id },
        include: {
          author: true,
          comments: {
            include: {
              user: true,
              likes: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
            },
          },
        },
      });

      return blog;
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBlogCount(filters: BlogFilters): Promise<number> {
    const whereClause = await this.buildWhereClause(filters);
    return await prisma.blogEntry.count({ where: whereClause });
  }

  static async getFeaturedBlogs(): Promise<BlogWithRelations[]> {
    try {
      const blogs = await prisma.blogEntry.findMany({
        take: 10,
        orderBy: [
          { views: { _count: "desc" } },
          { comments: { _count: "desc" } },
        ],
        include: {
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
            },
          },
        },
      });

      return blogs;
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
} 