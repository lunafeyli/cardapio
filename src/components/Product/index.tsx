import React from "react";
import "./styles.css";

type IProduct = {
	name: string;
	description: string;
	price: number;
	img: string;
};

const Product: React.FC<{
	product: IProduct;
	imgLeft: boolean;
	deleteFunc: (productToDelete: IProduct) => void;
}> = ({ product, imgLeft, deleteFunc }) => {
	return (
		<div
			className="product"
			style={{ flexDirection: imgLeft ? "row-reverse" : "row" }}
			onDoubleClick={() => deleteFunc(product)}
		>
			<div className="info">
				<span className="name">{product.name}</span>
				<p className="description">{product.description}</p>
			</div>
			<div className="image">
				<img
					src={
						product.img !== ""
							? product.img
							: "https://via.placeholder.com/192x128.png?text=Sem+foto"
					}
					alt={`Imagem de ${product.name}`}
				/>
				<span className="price">{`R$ ${product.price}`}</span>
			</div>
		</div>
	);
};

export { Product };
