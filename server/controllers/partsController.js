const Part = require('../models/Part'); // Import your Part Mongoose model
exports.searchParts = async (req, res) => {
    try {
        // Destructure query parameters from the request
        const {
            q, // General search query for text search
            vin,
            make,
            model,
            year,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1, // Default page to 1
            limit = 10 // Default limit to 10 results per page
        } = req.query;

        
        let query = {};

        let sortOptions = {};
        
        const searchConditions = [];
        if (q) {
            searchConditions.push({
                $text: {
                    $search: q // The search string
                }
            });

            sortOptions.score = { $meta: 'textScore' };
        }


        if (vin) {

            query.vin = new RegExp(vin, 'i');
        }
        if (make) {
            query.make = new RegExp(make, 'i');
        }
        if (model) {
            query.model = new RegExp(model, 'i');
        }
        if (year) {

            query.year = parseInt(year);
        }
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        if (minPrice || maxPrice) {
            query.price = {}; // Initialize price object
            if (minPrice) query.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
            if (maxPrice) query.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
        }

        if (searchConditions.length > 0) {

            if (Object.keys(query).length > 0) {
                searchConditions.push(query);
            }
            query = { $and: searchConditions };
        }


        if (sort) {
            switch (sort) {
                case 'priceAsc':
                    sortOptions.price = 1; // Ascending price
                    break;
                case 'priceDesc':
                    sortOptions.price = -1; // Descending price
                    break;
                case 'nameAsc':
                    sortOptions.name = 1; // Ascending name
                    break;
                case 'nameDesc':
                    sortOptions.name = -1; // Descending name
                    break;
                // Add more sorting options as needed
                default:
                    // If 'q' is present, default to text score, otherwise default to name ascending
                    if (!q) { // Only apply default name sort if no text search (as text search has its own relevance sort)
                        sortOptions.name = 1;
                    }
                    break;
            }
        } else if (!q) {
            // If no explicit sort and no text search, default to sorting by name ascending
            sortOptions.name = 1;
        }


        const pageNum = parseInt(page); // Current page number
        const limitNum = parseInt(limit); // Number of documents per page
        const skip = (pageNum - 1) * limitNum; // Number of documents to skip

        const parts = await Part.find(query)
                                .sort(sortOptions)
                                .skip(skip)
                                .limit(limitNum);


        const totalParts = await Part.countDocuments(query);
        //Giving JSON response
        res.status(200).json({
            success: true,
            count: parts.length, // Number of parts returned in this specific page
            total: totalParts,   // Total number of parts matching the query
            page: pageNum,       // Current page number
            pages: Math.ceil(totalParts / limitNum), // Total number of pages
            data: parts          // The array of part documents
        });

    } catch (error) {
        console.error('Error during part search:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};