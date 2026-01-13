import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { PersonalInformation } from "@/models/PersonalInformation";

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1e40af",
    paddingBottom: 15,
  },
  headerInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginLeft: 20,
  },
  section: {
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    paddingLeft: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    gap: 20,
  },
  twoColumn: {
    width: "48%",
  },
  fullWidth: {
    width: "100%",
  },
  fieldLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  fieldValue: {
    fontSize: 9,
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
    minHeight: 16,
  },
  emptyField: {
    fontSize: 9,
    color: "#9ca3af",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
    minHeight: 16,
  },
  gridRow: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  gridCol: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#666666",
  },
  signature: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 80,
  },
  signatureBox: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    marginTop: 30,
    paddingTop: 5,
    textAlign: "center",
  },
});

interface PersonalInformationPDFProps {
  data?: PersonalInformation;
}

const PersonalInformationPDF = ({ data }: PersonalInformationPDFProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const FieldRow = ({
    label,
    value,
    width = "100%",
  }: {
    label: string;
    value?: string;
    width?: string;
  }) => (
    <View style={{ width }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={value ? styles.fieldValue : styles.emptyField}>
        {value || " "}
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.schoolName}>DEPARTMENT OF EDUCATION</Text>
            <Text style={styles.documentTitle}>Personal Information Form</Text>
            <Text style={styles.subtitle}>Teacher Profile Documentation</Text>
          </View>
          {data?.photoBase64 && (
            <Image
              src={data.photoBase64}
              style={styles.profileImage}
            />
          )}
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="First Name"
                value={data?.firstName}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Last Name"
                value={data?.lastName}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Middle Name"
                value={data?.middleName}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Date of Birth"
                value={formatDate(data?.dateOfBirth)}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Gender"
                value={data?.gender}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Civil Status"
                value={data?.civilStatus}
              />
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Email Address"
                value={data?.emailAddress}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Mobile Number"
                value={data?.mobileNumber}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Home Address"
                value={data?.homeAddress}
              />
            </View>
          </View>
        </View>

        {/* Employment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Details</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Employee ID"
                value={data?.employeeId}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Position"
                value={data?.position}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Department"
                value={data?.department}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="Employment Status"
                value={data?.employmentStatus}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Date Hired"
                value={formatDate(data?.dateHired)}
              />
            </View>
            <View style={styles.gridCol}>
              <FieldRow
                label="Salary Grade"
                value={data?.salaryGrade}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FieldRow
                label="TIN"
                value={data?.tin}
              />
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Signature</Text>
            <Text style={{ fontSize: 8, color: "#666666", marginTop: 20 }}>
              Teacher
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Signature</Text>
            <Text style={{ fontSize: 8, color: "#666666", marginTop: 20 }}>
              Principal
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>Confidential - For Official Use Only</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonalInformationPDF;
