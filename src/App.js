import { Input } from 'antd';
import {SearchOutlined} from "@ant-design/icons"

import "antd/dist/reset.css";
import "./styles/app.sass"
import Actions from 'components/Actions';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="wrapper">
      <aside></aside>
      <header>
        <form className='header-form'>
          <Input prefix={<SearchOutlined />} />
        </form>
      </header>
      <main>

        <Actions />         
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
