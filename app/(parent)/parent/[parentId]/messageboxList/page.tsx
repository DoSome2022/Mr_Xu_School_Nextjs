const messageboxList = () => {

    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="col-span-3">
              <div className="flex justify-between">
                <p className="text-gray-500">信息信箱</p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded">返回</button>
              </div>
            </div>
            <div className="col-span-3 mt-8">
              <ul className="list-none p-0 w-full bg-white border border-blue-200">
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-blue-600 p-4 hover:bg-blue-200 hover:text-white">1-Dec 入學申請</a>
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-blue-600 p-4 hover:bg-blue-200 hover:text-white">2-Dec 請假申請</a>
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-blue-600 p-4 hover:bg-blue-200 hover:text-white">3-Dec 加堂申請</a>
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-blue-600 p-4 hover:bg-blue-200 hover:text-white">4-Dec 繳費通知</a>
                </li>
              </ul>
            </div>
            <div className="col-span-3 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
              <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
              <p>Whatsapp: 59190844</p>
              <p>info@target.edu.hk</p>
            </div>
          </div>
        </div>
      );

}

export default messageboxList