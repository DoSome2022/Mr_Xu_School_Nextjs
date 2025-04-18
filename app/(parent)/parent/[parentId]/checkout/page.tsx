const checkout = () => {

    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="col-span-3">
              <div className="flex justify-between">
                <p className="text-gray-500">付款清單</p>
                <div className="flex gap-2">
                  <button className="bg-blue-400 text-white px-4 py-2 rounded">付款紀錄</button>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded">返回</button>
                </div>
              </div>
            </div>
            <div className="col-span-3 mt-8">
              <ul className="list-none p-0 w-full bg-white border border-blue-200">
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-black p-4">恒常班 李同學 星期三 中文科 小三 中班 4:00 12月份 4,11,18,25 $880</a>
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  <a href="#" className="block text-black p-4">恒常班 李同學 星期三 英文文科 小三 中班 5:00 12月份 4,11,18,25 $880</a>
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  <input type="text" name="discount" id="discount" className="w-16 border-white rounded p-2" />
                </li>
                <li className="border-b border-blue-200 text-center text-lg">
                  Total：$1760 <button className="bg-blue-400 text-white px-4 py-2 rounded">付款</button>
                </li>
              </ul>
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

export default checkout