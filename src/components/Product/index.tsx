import React from "react";
import "./styles.css";
import {
	ChevronUp as UpArrowIcon,
	ChevronDown as DownArrowIcon,
	Edit2 as EditIcon,
	Trash as TrashIcon,
} from "react-feather";

type IProduct = {
	name: string;
	description: string;
	price: number;
	img: string;
};

interface Props {
	product: IProduct;
	imgLeft: boolean;
	deleteFunc: (productToDelete: IProduct) => void;
	reorderFunc: (index: number, dir: "up" | "down") => void;
	editFunc: (index: number) => void;
	index: number;
}

const Product: React.FC<Props> = ({
	product,
	imgLeft,
	deleteFunc,
	reorderFunc,
	index,
	editFunc,
}) => {
	return (
		<div
			className="product"
			style={{ flexDirection: imgLeft ? "row-reverse" : "row" }}
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
			<button
				className="delete only-html"
				onClick={() => deleteFunc(product)}
			>
				<TrashIcon size={20} color="#fafbff" />
			</button>
			<div className="actions only-html">
				<button
					className="actions__action"
					onClick={() => reorderFunc(index, "up")}
				>
					<UpArrowIcon size={22} color="#fafbff" />
				</button>
				<button
					className="actions__action"
					onClick={() => editFunc(index)}
				>
					<EditIcon size={18} color="#fafbff" />
				</button>
				<button
					className="actions__action"
					onClick={() => reorderFunc(index, "down")}
				>
					<DownArrowIcon size={22} color="#fafbff" />
				</button>
			</div>
		</div>
	);
};

export { Product };
