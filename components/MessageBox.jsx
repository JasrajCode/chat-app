import { format } from "date-fns";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser._id ? (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          {format(new Date(message?.createdAt), "MMMM d · p")}
        </p>
        <p className="w-fit bg-gray-500 p-3 rounded-lg text-base">
          {message?.text}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex gap-3 items-start justify-end">
      <div className="flex flex-col gap-2 items-end">
        <p className="text-sm">
          {format(new Date(message?.createdAt), "MMMM d · p")}
        </p>
        <p className="w-fit bg-blue-200 text-black p-3 rounded-lg text-base">
          {message?.text}
        </p>
      </div>
    </div>
  );
};

export default MessageBox;
