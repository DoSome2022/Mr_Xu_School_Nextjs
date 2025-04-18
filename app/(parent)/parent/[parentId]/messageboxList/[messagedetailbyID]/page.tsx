const MessageBoxDetail = () => {

    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="col-span-3">
              <div className="flex justify-between">
                <p className="text-gray-500">申請內容</p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded">返回</button>
              </div>
            </div>
            <div className="col-span-3 mt-8">
              <div className="bg-white p-4 h-full">
                <h2 className="text-2xl">入學申請</h2>
                <p className="text-left">學生李同學己成入學。</p>
                <p className="text-right">1-Dec-2024</p>
              </div>
            </div>
            <div className="col-span-3 flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-4">
              <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
              <p>Whatsapp: 59190844</p>
              <p>info@target.edu.hk</p>
            </div>
          </div>
        </div>
      );

}

export default MessageBoxDetail