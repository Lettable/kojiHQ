// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/config/db';
// import Category from '@/lib/model/Category.model';
// import Subcategory from '@/lib/model/SubCategory.model';
// import Forum from '@/lib/model/Forum.model';

// export async function POST(req) {
//   try {
//     await connectDB();
//     const action = req.nextUrl.searchParams.get('action');

//     const body = await req.json();

//     if (!action) {
//       return NextResponse.json({ error: 'Action parameter is required.' }, { status: 400 });
//     }

//     if (action === 'catog') {
//       const { name, description, index } = body;

//       if (!name || !index) {
//         return NextResponse.json({ error: 'Missing required fields for category creation.' }, { status: 400 });
//       }

//       const newCategory = new Category({ name, description, index });
//       await newCategory.save();

//       return NextResponse.json({ message: 'Category created successfully.', data: newCategory }, { status: 201 });
//     }

//     if (action === 'subcatog') {
//       const { name, description, categoryId, index } = body;

//       if (!name || !categoryId || index === undefined) {
//         return NextResponse.json({ error: 'Missing required fields for subcategory creation.' }, { status: 400 });
//       }

//       const category = await Category.findById(categoryId);
//       if (!category) {
//         return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
//       }

//       const newSubcategory = new Subcategory({ name, description, category: categoryId, index });
//       await newSubcategory.save();

//       return NextResponse.json({ message: 'Subcategory created successfully.', data: newSubcategory }, { status: 201 });
//     }

//     if (action === 'forum') {
//       const { name, description, subcategoryId, index, isClosed } = body;

//       if (!name || !subcategoryId || index === undefined) {
//         return NextResponse.json({ error: 'Missing required fields for forum creation.' }, { status: 400 });
//       }

//       const subcategory = await Subcategory.findById(subcategoryId);
//       if (!subcategory) {
//         return NextResponse.json({ error: 'Subcategory not found.' }, { status: 404 });
//       }

//       const newForum = new Forum({
//         name,
//         description,
//         subcategory: subcategoryId,
//         index,
//         isClosed: isClosed || false,
//       });
//       await newForum.save();

//       return NextResponse.json({ message: 'Forum created successfully.', data: newForum }, { status: 201 });
//     }

//     return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal server error.', details: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Category from '@/lib/model/Category.model';
import Subcategory from '@/lib/model/SubCategory.model';
import Forum from '@/lib/model/Forum.model';

export async function POST(req) {
  try {
    await connectDB();
    const action = req.nextUrl.searchParams.get('action');

    const body = await req.json();

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required.' }, { status: 400 });
    }

    // Helper function to handle single or bulk creation
    const handleCreation = async (Model, data) => {
      if (Array.isArray(data)) {
        return await Model.insertMany(data);
      } else {
        const newItem = new Model(data);
        return await newItem.save();
      }
    };

    // Handle Category creation
    if (action === 'catog') {
      const isArray = Array.isArray(body);
      const categories = isArray
        ? body.map(({ name, description, index }) => ({ name, description, index }))
        : { name: body.name, description: body.description, index: body.index };

      if (isArray && body.some((item) => !item.name || item.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields in some categories.' }, { status: 400 });
      }

      if (!isArray && (!body.name || body.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields for category creation.' }, { status: 400 });
      }

      const createdCategories = await handleCreation(Category, categories);
      return NextResponse.json(
        { message: isArray ? 'Categories created successfully.' : 'Category created successfully.', data: createdCategories },
        { status: 201 }
      );
    }

    // Handle Subcategory creation
    if (action === 'subcatog') {
      const isArray = Array.isArray(body);
      const subcategories = isArray
        ? body.map(({ name, description, categoryId, index }) => ({
            name,
            description,
            category: categoryId,
            index,
          }))
        : {
            name: body.name,
            description: body.description,
            category: body.categoryId,
            index: body.index,
          };

      if (isArray && body.some((item) => !item.name || !item.categoryId || item.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields in some subcategories.' }, { status: 400 });
      }

      if (!isArray && (!body.name || !body.categoryId || body.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields for subcategory creation.' }, { status: 400 });
      }

      const createdSubcategories = await handleCreation(Subcategory, subcategories);
      return NextResponse.json(
        { message: isArray ? 'Subcategories created successfully.' : 'Subcategory created successfully.', data: createdSubcategories },
        { status: 201 }
      );
    }

    // Handle Forum creation
    if (action === 'forum') {
      const isArray = Array.isArray(body);
      const forums = isArray
        ? body.map(({ name, description, subcategoryId, index, isClosed }) => ({
            name,
            description,
            subcategory: subcategoryId,
            index,
            isClosed: isClosed || false,
          }))
        : {
            name: body.name,
            description: body.description,
            subcategory: body.subcategoryId,
            index: body.index,
            isClosed: body.isClosed || false,
          };

      if (isArray && body.some((item) => !item.name || !item.subcategoryId || item.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields in some forums.' }, { status: 400 });
      }

      if (!isArray && (!body.name || !body.subcategoryId || body.index === undefined)) {
        return NextResponse.json({ error: 'Missing required fields for forum creation.' }, { status: 400 });
      }

      const createdForums = await handleCreation(Forum, forums);
      return NextResponse.json(
        { message: isArray ? 'Forums created successfully.' : 'Forum created successfully.', data: createdForums },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error.', details: error.message },
      { status: 500 }
    );
  }
}
