const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bayfiras:bayfiras150302@carpart.c1hq0el.mongodb.net/carpartdb?retryWrites=true&w=majority';

if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not defined in your .env file');
    console.warn('Better use .env file');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

const partSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        text: true
    },
    description: {
        type: String,
        trim: true,
        text: true
    },
    vin: {
        type: String,
        uppercase: true,
        trim: true,
        unique: true,
        sparse: true
    },
    make: {
        type: String,
        trim: true,
        text: true
    },
    model: {
        type: String,
        trim: true,
        text: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    partNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        text: true
    },
    category: {
        type: String,
        trim: true,
        text: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    stockQuantity: {
        type: Number,
        min: 0,
        default: 0
    },
}, {
    timestamps: true
});

partSchema.index({
    name: 'text',
    description: 'text',
    make: 'text',
    model: 'text',
    partNumber: 'text',
    category: 'text'
});

const Part = mongoose.model('Part', partSchema);

const sampleParts = [
    {
        name: "Premium Ceramic Brake Pads - Front",
        description: "High-performance ceramic brake pads designed for quiet operation and superior stopping power.",
        vin: "JF1GH2A1XGA123456", // Keep this one
        make: "Honda",
        model: "Civic",
        year: 2020,
        partNumber: "BP-HOCIV20-001",
        category: "Braking System",
        price: 89.99,
        stockQuantity: 120
    },
    {
        name: "Synthetic Blend Engine Oil Filter",
        description: "OEM quality oil filter for extended oil change intervals and engine protection.",
        vin: "JM1XP2B1XKA987654",
        make: "Toyota",
        model: "Camry",
        year: 2018,
        partNumber: "OF-TOYCAM18-002",
        category: "Engine Components",
        price: 15.75,
        stockQuantity: 250
    },
    {
        name: "Iridium Spark Plug Set (4-pack)",
        description: "Advanced iridium spark plugs for improved fuel efficiency and reliable ignition.",
        vin: "WBAKG2C1XLA234567",
        make: "BMW",
        model: "3 Series",
        year: 2019,
        partNumber: "SP-BMW3S19-003",
        category: "Ignition System",
        price: 45.00,
        stockQuantity: 90
    },
    {
        name: "Cabin Air Filter - Activated Carbon",
        description: "Filters dust, pollen, and odors for a cleaner cabin environment.",
        vin: "JF1GH2A1XGA789012", // Corrected: Changed this VIN to be unique
        make: "Honda",
        model: "CR-V",
        year: 2021,
        partNumber: "CAF-HOCRV21-004",
        category: "HVAC",
        price: 28.50,
        stockQuantity: 180
    },
    {
        name: "Headlight Assembly - Passenger Side",
        description: "Complete headlight assembly with LED daytime running lights.",
        vin: "1G1AP5L1XF1098765",
        make: "Chevrolet",
        model: "Silverado",
        year: 2022,
        partNumber: "HL-CHSIL22-005R",
        category: "Lighting",
        price: 210.00,
        stockQuantity: 30
    },
    {
        name: "Ignition Coil Pack",
        description: "Direct replacement ignition coil for reliable engine performance.",
        vin: "3FAHP0A7XGM112233",
        make: "Ford",
        model: "Focus",
        year: 2017,
        partNumber: "IC-FOFOC17-006",
        category: "Ignition System",
        price: 55.00,
        stockQuantity: 75
    },
    {
        name: "Fuel Pump Module",
        description: "Complete fuel pump module with sending unit for accurate fuel level readings.",
        make: "Nissan",
        model: "Altima",
        year: 2015,
        partNumber: "FP-NIALT15-007",
        category: "Fuel System",
        price: 180.00,
        stockQuantity: 40
    },
    {
        name: "Serpentine Belt",
        description: "Durable multi-rib serpentine belt for accessory drive systems.",
        make: "Hyundai",
        model: "Elantra",
        year: 2020,
        partNumber: "SB-HYELA20-008",
        category: "Engine Components",
        price: 32.00,
        stockQuantity: 100
    },
    {
        name: "Water Pump Assembly",
        description: "OEM quality water pump for efficient engine cooling.",
        make: "Volkswagen",
        model: "Jetta",
        year: 2016,
        partNumber: "WP-VWJET16-009",
        category: "Cooling System",
        price: 95.00,
        stockQuantity: 60
    },
    {
        name: "Shock Absorber - Rear Left",
        description: "Gas-pressurized shock absorber for improved ride comfort and handling.",
        make: "Subaru",
        model: "Outback",
        year: 2023,
        partNumber: "SA-SUOUT23-010L",
        category: "Suspension",
        price: 110.00,
        stockQuantity: 50
    },
    {
        name: "Air Compressor - AC System",
        description: "New AC compressor for optimal climate control performance.",
        make: "Audi",
        model: "A4",
        year: 2017,
        partNumber: "AC-AUA417-011",
        category: "HVAC",
        price: 350.00,
        stockQuantity: 25
    },
    {
        name: "Power Steering Pump",
        description: "Hydraulic power steering pump for easy steering.",
        make: "Mercedes-Benz",
        model: "C-Class",
        year: 2014,
        partNumber: "PSP-MBC14-012",
        category: "Steering System",
        price: 280.00,
        stockQuantity: 20
    },
    {
        name: "Radiator Assembly",
        description: "Aluminum core radiator for efficient engine cooling.",
        make: "Mazda",
        model: "CX-5",
        year: 2019,
        partNumber: "RAD-MACX519-013",
        category: "Cooling System",
        price: 160.00,
        stockQuantity: 35
    },
    {
        name: "Alternator",
        description: "New alternator for reliable electrical system charging.",
        make: "Kia",
        model: "Sportage",
        year: 2020,
        partNumber: "ALT-KISP20-014",
        category: "Electrical System",
        price: 190.00,
        stockQuantity: 45
    },
    {
        name: "Wheel Bearing and Hub Assembly - Front",
        description: "Complete front wheel bearing and hub assembly for smooth wheel rotation.",
        make: "Jeep",
        model: "Wrangler",
        year: 2021,
        partNumber: "WBH-JEWRA21-015F",
        category: "Drivetrain",
        price: 130.00,
        stockQuantity: 70
    }
];

const importData = async () => {
    try {
        await connectDB();
        console.log('Clearing existing part data...');
        await Part.deleteMany();
        console.log('Inserting sample part data...');
        await Part.insertMany(sampleParts);
        console.log('Sample Part Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`Error importing data: ${err.message}`);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await connectDB();
        console.log('Clearing all part data...');
        await Part.deleteMany();
        console.log('All Part Data Deleted Successfully!');
        process.exit();
    } catch (err) {
        console.error(`Error deleting data: ${err.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-import') {
    importData();
} else if (process.argv[2] === '-delete') {
    deleteData();
} else {
    console.log('Usage:');
    console.log('  node server/scripts/seed.js -import');
    console.log('  node server/scripts/seed.js -delete');
    process.exit(0);
}