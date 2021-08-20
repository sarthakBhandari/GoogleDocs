import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/dist/client/router";
import { db } from "../../firebase";
import {
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { getSession, useSession, signOut } from "next-auth/client";
import Login from "../../components/Login";
import TextEditor from "../../components/TextEditor";
import { io } from "socket.io-client";

const Doc = () => {
  const [session] = useSession();
  if (!session) return <Login />;

  const router = useRouter();
  const { id } = router.query;

  const [snapshot, loadingSnapshot] = useCollectionOnce(
    db.collection("userDocs").doc(session.user.email).collection("docs").doc(id)
  );
  // redirecting if user tries to access a URL they dont have access to
  if (!loadingSnapshot && !snapshot?.data()?.fileName) {
    router.replace("/");
  }

  return (
    <div>
      <header className="flex items-center justify-between p-3 pb-1">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Icon name="description" size="5xl" color="blue" />
        </span>
        <div className="flex-grow px-2">
          <h2>{snapshot && snapshot.data()?.fileName}</h2>
          <div className="flex items-center text-sm space-x-1 -ml-1 text-gray-600">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>
        <Button
          buttonType="filled"
          size="regular"
          color="lightBlue"
          block={false}
          className="hidden md:inline-flex h-10 "
          rounded={false}
          iconOnly={false}
          ripple="light"
        >
          <Icon name="people" size="md" />
          SHARE
        </Button>
        <img
          onClick={signOut}
          src={session.user.image}
          className="cursor-pointer rounded-full ml-2 h-10 w-10 object-cover"
          alt=""
        />
      </header>
      <TextEditor />
    </div>
  );
};

export default Doc;

// only works for components in pages folder
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
