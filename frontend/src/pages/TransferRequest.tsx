import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, AlertTriangle, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const TransferRequest = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerIdNumber: "",
    buyerEmail: "",
    buyerPhone: "",
    transferPrice: "",
    transferDate: "",
    documents: [] as File[],
    notes: ""
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList) => {
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...Array.from(files)] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
      toast({
        title: "Transfer Request Submitted",
        description: "Your property transfer request has been submitted to the blockchain for processing.",
      });
    }, 3000);
  };

  const mockParcel = {
    id: id || "PLT-2024-001",
    address: "123 Oak Street, Springfield",
    owner: "John Smith",
    estimatedValue: "$485,000"
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Property Information</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parcel ID</p>
                <p className="text-foreground">{mockParcel.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Owner</p>
                <p className="text-foreground">{mockParcel.owner}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Property Address</p>
                <p className="text-foreground">{mockParcel.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                <p className="text-foreground font-semibold">{mockParcel.estimatedValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Buyer Information</h3>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerName">Full Legal Name *</Label>
                <Input
                  id="buyerName"
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange("buyerName", e.target.value)}
                  placeholder="Enter buyer's full name"
                />
              </div>
              <div>
                <Label htmlFor="buyerIdNumber">Government ID Number *</Label>
                <Input
                  id="buyerIdNumber"
                  value={formData.buyerIdNumber}
                  onChange={(e) => handleInputChange("buyerIdNumber", e.target.value)}
                  placeholder="SSN, Driver's License, etc."
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerEmail">Email Address *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => handleInputChange("buyerEmail", e.target.value)}
                  placeholder="buyer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="buyerPhone">Phone Number</Label>
                <Input
                  id="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Transfer Details</h3>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transferPrice">Purchase Price *</Label>
                <Input
                  id="transferPrice"
                  value={formData.transferPrice}
                  onChange={(e) => handleInputChange("transferPrice", e.target.value)}
                  placeholder="$0.00"
                />
              </div>
              <div>
                <Label htmlFor="transferDate">Proposed Transfer Date *</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => handleInputChange("transferDate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information or special conditions..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Required Documents</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-foreground font-medium mb-2">Upload Documents</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload purchase agreement, ID verification, and any other supporting documents
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="document-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>
              
              {formData.documents.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-2">Uploaded Documents:</p>
                  <ul className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm text-foreground">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Review Transfer Request</h3>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Transfer Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Property</p>
                <p className="text-foreground">{mockParcel.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">From (Current Owner)</p>
                <p className="text-foreground">{mockParcel.owner}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">To (New Owner)</p>
                <p className="text-foreground">{formData.buyerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                <p className="text-foreground font-semibold">{formData.transferPrice}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transfer Date</p>
                <p className="text-foreground">{formData.transferDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-foreground">{formData.documents.length} files uploaded</p>
              </div>
            </div>
            {formData.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-foreground">{formData.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Important Notice</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• This transfer will be recorded on the blockchain and cannot be reversed</li>
                <li>• Both parties will receive email notifications throughout the process</li>
                <li>• The transfer requires approval from the current owner</li>
                <li>• Processing may take 3-5 business days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-success" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Transfer Request Submitted</h3>
        <p className="text-muted-foreground mb-4">
          Your property transfer request has been successfully submitted to the blockchain network.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="blockchain-hash">0x1a2b3c4d5e6f7890abcdef</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-warning font-medium">Pending Approval</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Processing:</span>
              <span className="text-foreground">3-5 business days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link to="/">Return to Search</Link>
        </Button>
        <Button asChild>
          <Link to={`/parcel/${id}`}>View Property</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/parcel/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Property
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Property Transfer Request</h1>
            <p className="text-muted-foreground">Blockchain-secured property ownership transfer</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-24 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Property & Buyer Info</span>
            <span>Transfer Details</span>
            <span>Review & Submit</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.buyerName || !formData.buyerEmail)) ||
                    (step === 2 && (!formData.transferPrice || !formData.transferDate))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {isSubmitting ? "Submitting to Blockchain..." : "Submit Transfer Request"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferRequest;