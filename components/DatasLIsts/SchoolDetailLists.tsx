import Link from "next/link";

interface School {
    id : string;
    school_name : string
}

interface SchoolDetailListsProps{
    data : School
}

//要小心留意　這是傳入來是用[] array包著　所以用.map()來解開　
//最好用console.log 查看　，是否之後都是用[] 包進來
const SchoolDetailLists = ({ data } : SchoolDetailListsProps) => {

    
    return(
        <>
        {data.map((d)=>{
            return(
                <>
                    <br />
                    學校名稱: {d.school_name}


                    <br />
                    <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${d.id}/bookLists`}>
                        書單列表
                    </Link>

                    <br />
                    <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${d.id}/expageLists`}>
                    考試卷
                    
                    </Link>

                    <br />
                    <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${d.id}/exscopeLists`}>
                    
                    考試範圍
                    </Link>
                    <br />
                    <Link className="text-stone-950 hover:text-gray-700" href={`/admin/schoolLists/${d.id}/extimeLists`}>
                    考試時間
                    </Link>


                    <br />
                    <Link className="text-stone-950 hover:text-gray-700"  href={`/admin/schoolLists/${d.id}/schooltimetableLists`}>

                    學校時間表
                    </Link>

                </>
            )
        })}
        </>
    )
}


export default SchoolDetailLists