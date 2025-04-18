import Link from "next/link";

interface Course {
    id : string;
    course_name: string,
    course_subject: string,
    persons: number,
    grade: number,
    course_level: string,
    teacher: string,
    class:[],
    student:[],
}


interface ClassDetailListsProps{
    data : Course
}

const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
  };


const ClassDetailLists = ({ data } : ClassDetailListsProps) => {
    console.log("課程：", data)
    return(
        <>
           <div>

            課程名稱: {data.course_name}
            <br />
            課程科目:{data.course_subject}

            <br />
            年級：{gradeMapping[data.grade]}

            <br />
            老師：{data.teacher}
            <br />
            <Link href={`/admin/courseLists/${data.id}/classLists`}>
            課堂數目: {data.class.length}
            </Link>
                <br />

                學生:{data?.student.map((student:any) => student.name)}
                <br />
            <Link href={`/admin/courseLists/${data.id}/AddStudent`} >
            加入學生
            </Link>
            <br />
           </div>
        </>
    )
}
export default ClassDetailLists