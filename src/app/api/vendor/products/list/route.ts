import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyVendorToken, extractTokenFromHeader } from "@/lib/vendor-jwt";
import Product from "@/models/Products";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    console.log(token);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const vendorData = verifyVendorToken(token);
    if (!vendorData) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isPublished = searchParams.get('isPublished');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: { vendorId: string; name?: { $regex: string; $options: string }; category?: string; isPublished?: boolean; $or?: Array<{ name: { $regex: string; $options: string } } | { description: { $regex: string; $options: string } } | { tags: { $regex: string; $options: string } }> } = {
      vendorId: vendorData.vendorId,
    };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add publish status filter
    if (isPublished !== null) {
      query.isPublished = isPublished === 'true';
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortOptions: { [key: string]: 1 | -1 } = {};
    switch (sortBy) {
      case 'price':
        sortOptions.finalPrice = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'views':
        sortOptions['stats.views'] = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'sales':
        sortOptions['stats.sales'] = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'rating':
        sortOptions['rating.average'] = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'stock':
        sortOptions.stock = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select({
          name: 1,
          description: 1,
          images: 1,
          basePrice: 1,
          finalPrice: 1,
          profitMargin: 1,
          discount: 1,
          category: 1,
          subCategory: 1,
          brand: 1,
          stock: 1,
          minimumOrderQuantity: 1,
          isPublished: 1,
          isSuspended: 1,
          suspensionReason: 1,
          stats: 1,
          rating: 1,
          createdAt: 1,
          updatedAt: 1,
        }),
      Product.countDocuments(query),
    ]);

    // Get unique categories for filters
    const categories = await Product.distinct('category', {
      vendorId: vendorData.vendorId,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      filters: {
        categories,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
} 