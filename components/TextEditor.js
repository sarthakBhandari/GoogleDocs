// error window is not defined, server doesnt have window object
// so we must import it to the client only and not nextjs server
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { db } from "../firebase";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useDocumentOnce, useDocument } from "react-firebase-hooks/firestore";
import { io } from "socket.io-client";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const [session] = useSession();
  const { id } = router.query;
  // const [socket, setSocket] = useState(null);

  const [snapshot] = useDocument(
    db.collection("userDocs").doc(session.user.email).collection("docs").doc(id)
  );

  // getting document text stored in firebase,
  // realtime changes detected because of useDocument hook
  // no need for socket io
  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
      setEditorState(EditorState.moveFocusToEnd);
    }
  }, [snapshot]);

  // // websocket
  // useEffect(() => {
  //   const s = io("http://localhost:3001");
  //   setSocket(s);

  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);

  // handeling and saving changes to firebase
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    // storable format
    const raw = convertToRaw(editorState.getCurrentContent());

    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .doc(id)
      .set(
        {
          // converting it to storable format
          editorState: raw,
        },
        {
          merge: true,
        }
      );
    // if (socket && socket.id) {
    //   const sender_socket_id = socket?.id;
    //   socket.emit("send-changes", { raw, sender_socket_id, id });
    //   socket.on("receive_changes", (raw_data) => {
    //     setEditorState(EditorState.createWithContent(convertFromRaw(raw_data)));
    //     setEditorState(EditorState.moveFocusToEnd);
    //   });
    // }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky z-50 top-0 !justify-center mx-auto"
        editorClassName="mt-6 bg-white shadow-md max-w-3xl mx-auto mb-12 p-10 border border-gray-300"
        editorState={editorState}
      />
    </div>
  );
};

export default TextEditor;
