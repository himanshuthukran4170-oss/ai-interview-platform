function AnalysisCard({title,items}){
    return (
        <div className="bg-grey-100 p-5 rounded-xl mt-5">
            <h3 className="text-xl font-bold mb-3">
                {title}
            </h3>

            <ul className="space-y-2">
                {items.map((item,index)=>(
                    <li key={index}>
                        -{item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default AnalysisCard;