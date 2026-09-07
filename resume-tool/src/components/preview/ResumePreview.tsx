import { useMemo } from 'react';
import { PDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import ResumeDocument from './ResumeDocument';

export default function ResumePreview() {
  const { getMergedResume, density, activeVersionId, versions } = useResumeStore();

  const mergedResume = useMemo(() => getMergedResume(), [
    // Recompute when store changes; we use a broad dependency
    useResumeStore.getState(),
  ]);

  // Force recompute on every render by calling getMergedResume directly
  const resume = getMergedResume();
  const activeVersion = activeVersionId
    ? versions.find((v) => v.id === activeVersionId)
    : null;

  const doc = <ResumeDocument resume={resume} density={density} />;
  const fileName = activeVersion
    ? `简历-${activeVersion.name}.pdf`
    : '简历.pdf';

  return (
    <>
      <div className="preview-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="preview-title">简历预览</span>
          {activeVersion && (
            <span className="preview-badge">{activeVersion.name}</span>
          )}
        </div>
        <BlobProvider document={doc}>
          {({ url, loading }) =>
            url && !loading ? (
              <a
                href={url}
                download={fileName}
                className="export-btn"
              >
                <Download size={14} />
                导出 PDF
              </a>
            ) : (
              <span className="export-btn" style={{ opacity: 0.5, cursor: 'default' }}>
                <Download size={14} />
                导出 PDF
              </span>
            )
          }
        </BlobProvider>
      </div>
      <div className="preview-container">
        <PDFViewer
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
          showToolbar={false}
        >
          {doc}
        </PDFViewer>
      </div>
    </>
  );
}
