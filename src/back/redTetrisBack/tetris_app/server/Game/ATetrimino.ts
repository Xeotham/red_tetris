import * as tc from "./tetrisConstants";
import { Pos } from "./Pos";
import { Matrix } from "./Matrix";
import { mod } from "./utils";
import { Mino } from "./Mino";

export abstract class ATetrimino {

	protected name:					string;
	protected rotation:				number;
	protected coordinates:			Pos;
	protected texture:				string;
	protected rotationType:			"original" | "SRS" | "SRSX";

	protected static struct:	tc.pieceStruct;
	protected static SpinCheck:	number[][];

	protected constructor(rotationType: "original" | "SRS" | "SRSX", name: string = "None",
				coordinates: Pos = new Pos(0, 0),
				texture: string = "Empty") {
		this.name = name;
		this.coordinates = coordinates;
		this.texture = texture;
		this.rotation = tc.NORTH;
		this.rotationType = rotationType;
	}

	protected abstract getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string;

	public toJSON() {
		return {
			name: this.name,
			rotation: this.rotation,
			texture: this.texture
		};
	}

	protected static convertBlock(jsonBlock: any): tc.block {
		let blocks: Pos[] = [];
		for (let i = 0; i < jsonBlock.blocks?.length || 0; ++i)
			blocks.push(new Pos(jsonBlock.blocks[i].x, jsonBlock.blocks[i].y));

		let original: Pos[] = [];
		for (let i = 0; i < jsonBlock.original?.length || 0; ++i)
			original.push(new Pos(jsonBlock.blocks[i].x, jsonBlock.blocks[i].y));

		let SRS: Pos[] = [];
		for (let i = 0; i < jsonBlock.SRS?.length || 0; ++i)
			SRS.push(new Pos(jsonBlock.SRS[i].x, jsonBlock.SRS[i].y));

		let SRSX: Pos[] = [];
		for (let i = 0; i < jsonBlock.SRSX?.length || 0; ++i)
			SRSX.push(new Pos(jsonBlock.SRSX[i].x, jsonBlock.SRSX[i].y));

		return ({
			blocks: blocks,
			original: original,
			SRS: SRS,
			SRSX: SRSX
		});
	};


	protected getStruct(): tc.pieceStruct {
		return (this.constructor as typeof ATetrimino).struct;
	}

	protected getSpinCheck(): number[][] {
		return (this.constructor as typeof ATetrimino).SpinCheck;
	}

	public rotate(direction: "clockwise" | "counter-clockwise" | "180", matrix: Matrix): string {
		let rotationPointUsed: number = -1;
		const struct = this.getStruct();
		let start: tc.block = struct[tc.ROTATIONS[this.rotation]];
		let end: tc.block | null = null;

		if (direction === "clockwise")
			end = struct[tc.ROTATIONS[mod(this.rotation + 1, 4)]];
		else if (direction === "180")
			end = struct[tc.ROTATIONS[mod(this.rotation + 2, 4)]];
		else
			end = struct[tc.ROTATIONS[mod(this.rotation + 3, 4)]];
		if (!end)
			return "";

		let startRotations: Pos[] = ((direction !== "180" && this.rotationType !== "original") ? start["SRS"] : start[this.rotationType]);
		let endRotations: Pos[] = ((direction !== "180" && this.rotationType !== "original") ? start["SRS"] : end[this.rotationType]);

		this.remove(matrix, false);

		for (let i = 0; i < startRotations.length; ++i) {
			const startPos: Pos = (direction === "180" ? new Pos(3, 3) : startRotations[i]);
			const endPos: Pos = endRotations[i];
			const dist = startPos.distanceToPos(endPos);

			const collides = () => {
				for (let j = 0; j < struct.nbBlocks; ++j)
					if (matrix.isMinoAt(this.coordinates.add(end.blocks[j]).add(dist)))
						return true;
				return false;
			}
			if (!collides()) {
				rotationPointUsed = i;
				this.coordinates = this.coordinates.add(dist);
				this.rotation = direction === "clockwise" ? mod(this.rotation + 1, 4) :
					direction === "180" ? mod(this.rotation + 2, 4) : mod(this.rotation + 3, 4);
				break ;
			}
		}
		this.place(matrix, false);
		return this.getSpin(matrix, rotationPointUsed);
	}

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		let checks: number[][] = this.getSpinCheck();
		if (checks.length > 1)
			for (let i = 0; i < this.rotation; ++i)
				checks = checks[0].map((val, index) => checks.map(row => row[index]).reverse())

		let major: number = 0;
		let minor: number = 0;
		for (let i = 0; i < checks.length; ++i) {
			for (let j = 0; j < checks[i].length; ++j) {
				if (checks[i][j] === 2 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++major;
				if (checks[i][j] === 3 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++minor;
			}
		}
		return this.getSpinSpecific(matrix, major, minor, rotationPointUsed);
	}

	public isColliding(matrix: Matrix, offset: Pos = new Pos(0, 0)): boolean {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: Pos = this.coordinates.add(block?.blocks[i]).add(offset);
			if (matrix.isMinoAt(pos))
				return true;
		}
		return false;
	}

	public place(matrix: Matrix, isSolid: boolean = false, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: Pos = this.coordinates.add(block?.blocks[i]);
			if (pos.getY() < 0)
				return ;
			if (!isShadow || (isShadow && matrix.at(pos).isEmpty())) {
				matrix.setAt(pos, new Mino(this.texture, isSolid));
				if (isShadow)
					matrix.at(pos).setShadow(true);
			}
		}
	}

	public remove(matrix: Matrix, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: Pos = this.coordinates.add(block?.blocks[i]);
			if (!isShadow || (isShadow && matrix.at(pos).getIsShadow()))
				matrix.setAt(pos, new Mino("EMPTY", false));
		}
	}

	public getCoordinates(): Pos				{ return this.coordinates; }
	public setCoordinates(pos: Pos): void		{ this.coordinates = pos; }

	public getTexture(): string					{ return this.texture; }
	public setTexture(texture: string): void	{ this.texture = texture; }

	public getName(): string					{ return this.name; }
	public setName(name: string): void			{ this.name = name; }

	public getRotation(): number				{ return this.rotation; }
	public setRotation(rotation: number): void	{ this.rotation = rotation; }


	public canFall(matrix: Matrix): boolean {
		return !this.isColliding(matrix, new Pos(0, 1));
	}

	public canSlide(matrix: Matrix) {
		return !this.isColliding(matrix, new Pos(1, 0)) || !this.isColliding(matrix, new Pos(-1, 0));
	}

}
