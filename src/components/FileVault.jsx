import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import Btn from './Btn';
import { FileText, Download, Trash2, Upload, Loader2 } from 'lucide-react';

export default function FileVault({ sessionId, isTeacher }) {
    const { currentUser } = useAuth();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, "sessions", sessionId, "files"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const filesData = [];
            snapshot.forEach((doc) => {
                filesData.push({ id: doc.id, ...doc.data() });
            });
            setFiles(filesData);
        });

        return () => unsubscribe();
    }, [sessionId]);

    async function handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Teacher only check (client-side, security rules handle server-side)
        if (!isTeacher) {
            alert("Only the teacher can upload files.");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload to Storage
            const storageRef = ref(storage, `sessions/${sessionId}/files/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            // 2. Save metadata to Firestore
            await addDoc(collection(db, "sessions", sessionId, "files"), {
                name: file.name,
                url: url,
                path: storageRef.fullPath, // Needed for deletion
                by: currentUser.uid,
                createdAt: new Date()
            });

        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload file.");
        }
        setUploading(false);
    }

    async function handleDelete(file) {
        if (!confirm("Delete this file?")) return;

        try {
            // 1. Delete from Storage
            const storageRef = ref(storage, file.path);
            await deleteObject(storageRef);

            // 2. Delete from Firestore
            await deleteDoc(doc(db, "sessions", sessionId, "files", file.id));

        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete file.");
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    File Vault
                </h3>
                {isTeacher && (
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Upload
                        </label>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {files.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 text-sm">
                        No files shared yet.
                        {isTeacher && <br /> && "Upload resources for your student."}
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                                    title="Download"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                                {isTeacher && (
                                    <button
                                        onClick={() => handleDelete(file)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
