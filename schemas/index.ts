import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Agency name required" }),
  email: z.string().min(1, { message: "Email is required" }).email(),
  phone: z
    .string()
    .min(1, { message: "Business Phone is required" })
    .refine(
      (value) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone format
        return phoneRegex.test(value);
      },
      { message: "Enter a valid phone number" }
    ),
  location: z.string().min(1, { message: "Location is required" }),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email/Phone is required" })
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone format
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: "Enter a valid email or phone number" }
    ),
  password: z.string().min(4, { message: "Atleast 4 characters" }),
});

export const BookingSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  vehiclePlateNumber: z
    .string()
    .min(1, { message: "Vehicle plate number is required" }),
  unitCostPerDay: z
    .number({ invalid_type_error: "Unit cost per day must be a number" })
    .positive("Unit cost per day must be positive"),
  totalCost: z
    .number({ invalid_type_error: "Total cost must be a number" })
    .positive("Total cost must be positive"),
  agencyName: z.string().min(1, { message: "Agency name is required" }),
});

export const VehicleSchema = z.object({
  vehiclePlateNumber: z
    .string()
    .min(3, { message: "Vehicle PlateNumber is required" }),
  vehicleType: z.string().min(2, { message: "Vehicle Type is required" }),
  vehicleMake: z.string().min(2, { message: "Vehicle Make is required" }),
  vehicleColor: z.string().min(2, { message: "Color is required" }),
  vehicleEngineCapacity: z
    .string()
    .min(2, { message: "Engine Capacity is required" }),
  vehicleSeatsCapacity: z
    .string()
    .min(1, { message: "Seats Capacity is required" }),
  vehicleYearOfManufacture: z
    .string()
    .min(4, { message: "Year of Manufacture is required" }),
  vehicleBodyType: z.string().min(1, { message: "Body Type is required" }),
  vehicleMillage: z.string().min(1, { message: "Mileage is required" }),

  vehicleFrontImage: z.any().optional(),
  vehicleSideImage: z.any().optional(),
  vehicleBackImage: z.any().optional(),
  vehicleInteriorFrontImage: z.any().optional(),
  vehicleInteriorBackImage: z.any().optional(),

  unitCostPerDay: z
    .number({ invalid_type_error: "Unit cost per day must be a number" })
    .positive("Unit cost per day must be positive"),
  agencyName: z.string().min(1, { message: "Agency name is required" }),
});

export const UpdateVehicleSchema = z.object({
  ownerUserId: z.string(),
  vehiclePlateNumber: z
    .string()
    .min(3, { message: "Vehicle PlateNumber is required" }),
  vehicleType: z.string().min(2, { message: "Vehicle Type is required" }),
  vehicleMake: z.string().min(2, { message: "Vehicle Make is required" }),
  vehicleColor: z.string().min(2, { message: "Color is required" }),
  vehicleEngineCapacity: z
    .string()
    .min(2, { message: "Engine Capacity is required" }),
  vehicleSeatsCapacity: z
    .string()
    .min(1, { message: "Seats Capacity is required" }),
  vehicleYearOfManufacture: z
    .string()
    .min(4, { message: "Year of Manufacture is required" }),
  vehicleBodyType: z.string().min(1, { message: "Body Type is required" }),
  vehicleMillage: z.string().min(1, { message: "Mileage is required" }),

  vehicleFrontImage: z.any().optional(),
  vehicleSideImage: z.any().optional(),
  vehicleBackImage: z.any().optional(),
  vehicleInteriorFrontImage: z.any().optional(),
  vehicleInteriorBackImage: z.any().optional(),

  unitCostPerDay: z
    .number({ invalid_type_error: "Unit cost per day must be a number" })
    .positive("Unit cost per day must be positive"),
  agencyName: z.string().min(1, { message: "Agency name is required" }),
});

export const RenterVehicleSchema = z.object({
  vehicleFrontImage: z.string().min(2, { message: "FrontImage is required" }),
});
