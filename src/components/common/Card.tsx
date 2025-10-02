// ========================== src/components/common/Card.tsx ==========================
import React from 'react';
import { formatDate } from '../../utils/helpers';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, createdAt }) => (
  <div className="card w-full bg-base-100 shadow-md">
    <figure><img src={imageUrl} alt={title} /></figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
    </div>
  </div>
);

export default Card;
