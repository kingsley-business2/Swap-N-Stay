// src/pages/PostGoods.tsx

import React from 'react';

const PostGoods: React.FC = () => {
    return (
        <div className="container mx-auto p-4 max-w-4xl mt-10">
            <h1 className="text-4xl font-extrabold mb-8 text-primary">Post Your Goods or Services</h1>
            
            <div className="bg-base-200 p-6 rounded-lg shadow-xl">
                <p className="mb-4 text-lg text-base-content/80">
                    Use this form to list agricultural products, livestock, or related services for sale or exchange.
                </p>
                
                {/* Placeholder for actual form logic */}
                <div className="border border-dashed border-base-content/30 p-8 rounded-lg text-center my-6">
                    <p className="text-base-content/60">
                        *This is the form area where you will add inputs for Title, Description, Price, etc.*
                    </p>
                </div>

                <div className="flex justify-end">
                    <button className="btn btn-success text-white text-lg px-8">Submit Listing</button>
                </div>
            </div>
        </div>
    );
};

export default PostGoods;
