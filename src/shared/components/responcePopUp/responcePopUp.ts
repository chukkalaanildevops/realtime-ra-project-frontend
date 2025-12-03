import { message } from 'antd';
import { MessageType } from 'antd/lib/message';

function success(msg?: string): MessageType {
  return message.success(msg);
}

function error(msg?: string): MessageType {
  return message.error(msg);
}
function loading(isLoading: boolean, msg?: string): MessageType {
  return message.loading(msg, isLoading ? 0 : 1.5);
}
function destroy() {
  return message.destroy();
}
export { success, error, loading, destroy };
