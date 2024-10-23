// "use client"

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';

// // Yup schema for form validation
// const schema = yup.object().shape({
//   vehicleFrontImage: yup
//     .mixed()
//     .test('required', 'Please upload a vehicle front image', (value) => value && value.length > 0),
//   vehicleSideImage: yup
//     .mixed()
//     .test('required', 'Please upload a vehicle side image', (value) => value && value.length > 0),
//   vehicleBackImage: yup
//     .mixed()
//     .test('required', 'Please upload a vehicle back image', (value) => value && value.length > 0),
// });

// const VehicleForm = () => {
//   const { register, handleSubmit, watch, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const [images, setImages] = useState({
//     frontImage: '',
//     sideImage: '',
//     backImage: '',
//   });

//   // Convert file to base64 and preview
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         // Set image preview
//         setImages((prevImages) => ({ ...prevImages, [imageType]: reader.result?.toString() || '' }));

//         // Log the base64 string in the console
//         console.log(`${imageType} base64 string: `, reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = (data: any) => {
//     // Handle form submission logic (e.g., send the base64 strings to an API)
//     console.log("Form submitted with base64 images");
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label htmlFor="vehicleFrontImage">Front Image</label>
//           <input
//             type="file"
//             {...register('vehicleFrontImage')}
//             onChange={(e) => handleImageChange(e, 'frontImage')}
//           />
//           {errors.vehicleFrontImage && <p>{errors.vehicleFrontImage.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="vehicleSideImage">Side Image</label>
//           <input
//             type="file"
//             {...register('vehicleSideImage')}
//             onChange={(e) => handleImageChange(e, 'sideImage')}
//           />
//           {errors.vehicleSideImage && <p>{errors.vehicleSideImage.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="vehicleBackImage">Back Image</label>
//           <input
//             type="file"
//             {...register('vehicleBackImage')}
//             onChange={(e) => handleImageChange(e, 'backImage')}
//           />
//           {errors.vehicleBackImage && <p>{errors.vehicleBackImage.message}</p>}
//         </div>

//         <button type="submit">Submit</button>
//       </form>

//       {/* Display uploaded image previews */}
//       <div className="image-preview">
//         {images.frontImage && <img src={images.frontImage} alt="Front" width="100" />}
//         {images.sideImage && <img src={images.sideImage} alt="Side" width="100" />}
//         {images.backImage && <img src={images.backImage} alt="Back" width="100" />}
//       </div>
//     </div>
//   );
// };

// export default VehicleForm;
