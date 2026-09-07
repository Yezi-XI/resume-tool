import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Resume, Density } from '../../types/resume';

// Register Chinese font
try {
  Font.register({
    family: 'Noto Sans SC',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_EnYxNbPzS5HE.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnIxNbPzS5HE.ttf', fontWeight: 700 },
    ],
  });
} catch {
  // Fallback to default font
}

const FONT_FAMILY = 'Noto Sans SC';

const DENSITY_CONFIG: Record<Density, { fontSize: number; lineHeight: number; sectionGap: number; itemGap: number; titleSize: number }> = {
  compact: { fontSize: 9, lineHeight: 1.3, sectionGap: 8, itemGap: 4, titleSize: 12 },
  normal: { fontSize: 10, lineHeight: 1.5, sectionGap: 12, itemGap: 6, titleSize: 14 },
  spacious: { fontSize: 11, lineHeight: 1.7, sectionGap: 16, itemGap: 10, titleSize: 16 },
};

function createStyles(density: Density) {
  const cfg = DENSITY_CONFIG[density];
  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: FONT_FAMILY,
      fontSize: cfg.fontSize,
      lineHeight: cfg.lineHeight,
      color: '#1a1a1a',
    },
    header: {
      marginBottom: cfg.sectionGap + 4,
      borderBottom: '2px solid #1a1a1a',
      paddingBottom: cfg.sectionGap,
    },
    name: {
      fontSize: cfg.titleSize + 8,
      fontWeight: 700,
      marginBottom: 4,
    },
    title: {
      fontSize: cfg.titleSize,
      color: '#555',
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      fontSize: cfg.fontSize - 1,
      color: '#666',
    },
    contactItem: {
      marginRight: 12,
    },
    contactSep: {
      color: '#ccc',
      marginHorizontal: 4,
    },
    section: {
      marginBottom: cfg.sectionGap,
    },
    sectionTitle: {
      fontSize: cfg.titleSize,
      fontWeight: 700,
      borderBottom: '1px solid #ddd',
      paddingBottom: 3,
      marginBottom: cfg.itemGap + 2,
    },
    item: {
      marginBottom: cfg.itemGap,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    itemTitle: {
      fontWeight: 700,
      fontSize: cfg.fontSize + 0.5,
    },
    itemSubtitle: {
      fontSize: cfg.fontSize,
      color: '#555',
    },
    itemDate: {
      fontSize: cfg.fontSize - 1,
      color: '#888',
    },
    itemDesc: {
      fontSize: cfg.fontSize,
      lineHeight: cfg.lineHeight,
      color: '#444',
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillTag: {
      fontSize: cfg.fontSize,
    },
    summaryText: {
      fontSize: cfg.fontSize,
      lineHeight: cfg.lineHeight,
      color: '#444',
    },
  });
}

interface ResumeDocumentProps {
  resume: Resume;
  density: Density;
}

export default function ResumeDocument({ resume, density }: ResumeDocumentProps) {
  const styles = createStyles(density);
  const { personalInfo, sections } = resume;

  const contacts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {personalInfo.name ? (
            <Text style={styles.name}>{personalInfo.name}</Text>
          ) : (
            <Text style={{ ...styles.name, color: '#ccc' }}>姓名</Text>
          )}
          {personalInfo.title && (
            <Text style={styles.title}>{personalInfo.title}</Text>
          )}
          {contacts.length > 0 && (
            <View style={styles.contactRow}>
              {contacts.map((c, i) => (
                <Text key={i} style={styles.contactItem}>
                  {c}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>
              {section.title || section.type}
            </Text>

            {section.type === 'summary' ? (
              section.items.map((item) => (
                <Text key={item.id} style={styles.summaryText}>
                  {item.description}
                </Text>
              ))
            ) : section.type === 'skills' ? (
              section.items.map((item) => (
                <View key={item.id} style={styles.item}>
                  {item.title && (
                    <Text style={{ ...styles.itemTitle, marginBottom: 2 }}>
                      {item.title}
                    </Text>
                  )}
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
              ))
            ) : (
              section.items.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      {item.title && (
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      )}
                      {item.subtitle && (
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                    {(item.startDate || item.endDate) && (
                      <Text style={styles.itemDate}>
                        {item.startDate}
                        {item.startDate && item.endDate ? ' - ' : ''}
                        {item.endDate}
                      </Text>
                    )}
                  </View>
                  {item.description && (
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
