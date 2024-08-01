interface SortableCategoryProps {
    category:string;
    hoveredCategory:number;
    id: number
    activatingMethod(id: number): void
    ascendingSortingMethod(): void
    descendingSortingMethod(): void
}

export default function SortableCategory({category, hoveredCategory, id, activatingMethod, ascendingSortingMethod, descendingSortingMethod}: SortableCategoryProps) {
    return (
        <div onMouseEnter={() => {activatingMethod(id)}} onMouseLeave={() => {activatingMethod(0)}} className="container-fluid head-item">
            <div className="row align-items-end">
                <div className="col">
                    {category}
                </div>
                {hoveredCategory == id &&
                    <div className="col-3">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col">
                                    <button onClick={ascendingSortingMethod} className="btn sorting-btn">
                                        <img src="src/assets/sort_triangle_flipped.png" height="11" alt="Sort"/>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button onClick={descendingSortingMethod} className="btn sorting-btn">
                                        <img src="src/assets/sort_triangle.png" height="11" alt="Sort"/>
                                    </button> 
                                </div>
                            </div>
                        </div> 
                    </div>
                }
            </div>     
        </div>
    )
}