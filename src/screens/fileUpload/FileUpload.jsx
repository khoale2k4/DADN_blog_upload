import React, { useState } from 'react';
import FileUploader from '../../components/fileUpload/step1';
import FileDescription from '../../components/fileUpload/step2';
import UploadSuccess from '../../components/fileUpload/step3';
import ActiveStep from '../../components/fileUpload/activeStep';
import contants from '../../core/contants';
import axios from "axios";

const FileUpload = () => {
    const [activeStep, setActiveStep] = useState(1);

    const [files, setFiles] = useState([]);

    const handleFileChange = async (e) => {
        const selectedFiles = [...e.target.files];

        const newFiles = selectedFiles.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            progress: 0,
            url: null,
        }));

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

        for (let fileObj of newFiles) {
            try {
                const initRes = await axios.get(contants.getPresignUrlEndpoint);

                const uploadUrl = initRes.data.url;
                const fileId = initRes.data.fileId;

                await axios.put(uploadUrl, selectedFiles.find(f => f.name === fileObj.name), {
                    headers: { "Content-Type": selectedFiles.find(f => f.name === fileObj.name).type },
                    onUploadProgress: (event) => {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        setFiles((prevFiles) =>
                            prevFiles.map((f) =>
                                f.id === fileObj.id ? { ...f, progress: percent } : f
                            )
                        );
                    },
                });

                const fileLink = initRes.data.fileLink || uploadUrl;

                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === fileObj.id
                            ? { ...f, id: fileId, progress: 100, url: fileLink }
                            : f
                    )
                );
            } catch (err) {
                console.error(err);
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === fileObj.id ? { ...f, status: "error" } : f
                    )
                );
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = [...e.dataTransfer.files].map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            progress: 0,
        }));
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        // TODO: Thêm logic bắt đầu upload file tại đây
    };

    const handleUpdateMetadata = async () => {
        for (let file of files) {
            await axios.post(contants.postFileMetadataEndpoint, {
                id: file.id,
                title: file.name,
                university: file.university,
                course: file.course,
                description: file.description,
                downloadUrl: file.url,
            });
        }
    }

    const handleRestart = () => {
        setFiles([]);
        setActiveStep(1);
    }

    const handleDeleteFile = (fileId) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    };

    return (
        <div className="flex flex-col items-center w-full p-8 bg-white h-screen">
            <div className="w-3/4 flex flex-row mb-8">
                <ActiveStep isActice={activeStep >= 1} title={'Upload'} description={'Upload your documents'} step={1} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 2} title={'Details'} description={'Describe your documents'} step={2} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 3} title={'Done'} description={'Upload completed'} step={3} />
            </div>

            <div className="w-1/2 text-center text-sm font-medium text-gray-500">

                {activeStep == 1 && <FileUploader
                    files={files}
                    onFileChange={handleFileChange}
                    onDeleteFile={handleDeleteFile}
                />}
                {activeStep == 2 && <FileDescription
                    files={files}
                    onFilesChange={setFiles}
                />}
                {activeStep == 3 && <UploadSuccess />}

                {activeStep < 3 && <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50"
                        onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                        disabled={activeStep === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                        // disabled={files.every((file) => file.progress === 100)}
                        onClick={() => {
                            setActiveStep(Math.min(3, activeStep + 1));
                            if (activeStep === 2) {
                                handleUpdateMetadata();
                            }
                        }}
                    >
                        {activeStep == 2 ? 'Save' : 'Next'}
                    </button>
                </div>}
                {activeStep === 3 && <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    onClick={() => handleRestart()}
                >
                    Upload more Documents
                </button>}
            </div>

        </div>
    );
};

export default FileUpload;