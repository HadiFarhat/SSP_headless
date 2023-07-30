import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4 d-flex">
      <Link href={`category${category.path}`}>
        <div className="card h-100 d-flex flex-column">
          <img 
            src={category.image?.url} 
            className="card-img-top" 
            alt={category.name} 
            style={{height: '200px', width: '200px', objectFit: 'cover'}} //set a fixed height and width and use object-fit: cover
          />
          <div className="card-body mt-auto">
            <h5 className="card-title">{category.name}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
}
