export class Product {
	constructor(
		name: string,
		description: string,
		price: number,
		image?: FileList | null
	) {
		let result: string | ArrayBuffer | null | undefined = "";
		function readURL(files: FileList) {
			if (files && files[0]) {
				let reader = new FileReader();

				reader.onload = function (e) {
					result = e.target?.result;
					// return result;
				};

				reader.readAsDataURL(files[0]);
			}
		}

		if (result !== "") {
			console.log(result);
			return {
				name,
				description,
				price,
				img: result,
			};
		}
	}
}
