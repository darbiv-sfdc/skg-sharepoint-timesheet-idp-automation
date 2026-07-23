# Boomi XML Patterns Reference

**Purpose**: Detailed XML extraction patterns for all Boomi component and shape types.  
**Author**: Cheppali Shaik Sohail  
**Version**: 2.1.0

---

## Component XML Patterns

### Process Component
```xml
<bns:Component type="process" name="ProcessName" componentId="uuid">
  <bns:object>
    <process>
      <shapes>
        <shape shapetype="start|branch|map|connector|trycatch|stop">
          <configuration>...</configuration>
          <dragpoints>
            <dragpoint toShape="nextShape" sequenceId="1"/>
          </dragpoints>
        </shape>
      </shapes>
    </process>
  </bns:object>
</bns:Component>
```

### Map Component
```xml
<bns:Component type="transform.map" name="MapName">
  <bns:object>
    <Map fromProfile="profileId" toProfile="profileId">
      <Mappings>
        <Mapping fromKey="key" fromNamePath="path" toKey="key" toNamePath="path"/>
      </Mappings>
      <Functions optimizeExecutionOrder="true"/>
    </Map>
  </bns:object>
</bns:Component>
```

### Transform Function Component (UDF)
```xml
<bns:Component type="transform.function" name="FunctionName">
  <bns:object>
    <Function>
      <Inputs><Input key="1" name="inputName"/></Inputs>
      <Outputs><Output key="1" name="outputName"/></Outputs>
      <Steps>
        <FunctionStep category="String|Lookup|ProcessProperty" type="StringConcat|CrossRefLookup|PropertyGet">
          <Configuration>...</Configuration>
        </FunctionStep>
      </Steps>
      <Mappings>...</Mappings>
    </Function>
  </bns:object>
</bns:Component>
```

### Process Property Component
```xml
<bns:Component type="processproperty" name="PropertySetName">
  <bns:object>
    <DefinedProcessProperties>
      <definedProcessProperty key="uuid">
        <label>PropertyName</label>
        <type>string</type>
        <defaultValue>value</defaultValue>
      </definedProcessProperty>
    </DefinedProcessProperties>
  </bns:object>
</bns:Component>
```

### XSLT Component
```xml
<bns:Component type="xslt" name="XSLTName">
  <bns:object>
    <Xslt>
      <stylesheet>&lt;xsl:stylesheet...&gt;</stylesheet>
    </Xslt>
  </bns:object>
</bns:Component>
```

### Web Service Component
```xml
<bns:Component type="webservice" name="APIName">
  <bns:object>
    <webservice urlPath="v1.0/path">
      <restApi/>
      <soapApi wsdlServiceName="ServiceName">
        <endpoint processId="uuid" operationName="operation"/>
      </soapApi>
      <metaInfo title="API Title" version="1.0"/>
    </webservice>
  </bns:object>
</bns:Component>
```

### Flat File Profile Component
```xml
<bns:Component type="profile.flatfile" name="ProfileName">
  <bns:object>
    <FlatFileProfile>
      <ProfileProperties>
        <GeneralInfo fileType="delimited"/>
        <Options><DelimitedOptions fileDelimiter="stardelimited"/></Options>
      </ProfileProperties>
      <DataElements>
        <FlatFileRecord><FlatFileElement name="fieldName"/></FlatFileRecord>
      </DataElements>
    </FlatFileProfile>
  </bns:object>
</bns:Component>
```

---

## Shape XML Patterns

### Document Properties Shape (CRITICAL - Most Frequent)

Extract ALL valueTypes used in document property assignments:

```xml
<shape shapetype="documentproperties" userlabel="Set Properties">
  <configuration>
    <documentproperties>
      <documentproperty name="DPP_PropertyName" propertyId="process.DPP_PropertyName">
        <sourcevalues>
          <!-- Type 1: Static Value -->
          <parametervalue valueType="static">
            <staticparameter staticproperty="hardcoded_value"/>
          </parametervalue>
          
          <!-- Type 2: Cross-Reference Lookup -->
          <parametervalue valueType="crossref">
            <crossrefparameter crossRefTableId="uuid" outputParamId="2" outputParamName="ColumnName">
              <inputs>
                <parametervalue elementToSetName="InputColumn" valueType="static">
                  <staticparameter staticproperty="lookupKey"/>
                </parametervalue>
              </inputs>
            </crossrefparameter>
          </parametervalue>
          
          <!-- Type 3: Profile Element Extraction -->
          <parametervalue valueType="profile">
            <profileelement elementId="104" elementName="FieldName" profileId="uuid"/>
          </parametervalue>
          
          <!-- Type 4: Execution Property -->
          <parametervalue valueType="execution">
            <executionparameter executionproperty="Node Id|Process Id"/>
          </parametervalue>
          
          <!-- Type 5: Track Property -->
          <parametervalue valueType="track">
            <trackparameter propertyId="meta.base.xxx" propertyName="Base - Property"/>
          </parametervalue>
          
          <!-- Type 6: Process Property -->
          <parametervalue valueType="process">
            <processparameter processproperty="DPP_PropertyName"/>
          </parametervalue>
        </sourcevalues>
      </documentproperty>
    </documentproperties>
  </configuration>
</shape>
```

### Process Route Shape
```xml
<shape shapetype="processroute" userlabel="Route Name">
  <configuration>
    <processroutecall abort="false" processRouteId="resource::rout:uuid" processRouteName="[FWK] Process Name" wait="true">
      <returnpaths/>
      <routeParameter key="0" valueType="process">
        <processparameter processproperty="DPP_RouteKey"/>
      </routeParameter>
    </processroutecall>
  </configuration>
</shape>
```

### Process Call Shape
```xml
<shape shapetype="processcall" userlabel="Process Call">
  <configuration>
    <processcall abort="true" processId="uuid" wait="true">
      <parameters/>
      <returnpaths>
        <returnpaths childShapeName="shape6" returnLabel="Error"/>
      </returnpaths>
    </processcall>
  </configuration>
</shape>
```

### Decision Shape
```xml
<shape shapetype="decision" userlabel="Condition Name?">
  <configuration>
    <decision comparison="equal|wildcard|notequal" name="ConditionName">
      <decisionvalue valueType="track|current|static|process">
        <trackparameter propertyId="meta.base.xxx"/>
      </decisionvalue>
      <decisionvalue valueType="static">
        <staticparameter staticproperty="expected_value"/>
      </decisionvalue>
    </decision>
  </configuration>
  <dragpoints>
    <dragpoint identifier="true" text="True" toShape="successPath"/>
    <dragpoint identifier="false" text="False" toShape="failurePath"/>
  </dragpoints>
</shape>
```

### Message Shape
```xml
<shape shapetype="message" userlabel="Message Name">
  <configuration>
    <message combined="false">
      <msgTxt>&lt;ErrorMessage&gt;{1}&lt;/ErrorMessage&gt;</msgTxt>
      <msgParameters>
        <parametervalue valueType="track">
          <trackparameter propertyId="meta.base.catcherrorsmessage"/>
        </parametervalue>
      </msgParameters>
    </message>
  </configuration>
</shape>
```

### Data Process Shape
```xml
<shape shapetype="dataprocess" userlabel="Split/Transform">
  <configuration>
    <dataprocess>
      <split profileId="uuid" profileKey="elementKey"/>
      <xslt xsltId="uuid"/>
    </dataprocess>
  </configuration>
</shape>
```

### Doc Cache Load Shape
```xml
<shape shapetype="doccacheload" userlabel="Cache Operation">
  <configuration>
    <doccache cacheId="uuid" operation="add|get"/>
  </configuration>
</shape>
```

### Return Documents Shape
```xml
<shape shapetype="returndocuments" userlabel="Return Label">
  <configuration>
    <returndocuments label="Error|Success"/>
  </configuration>
</shape>
```

### Notify Shape
```xml
<shape shapetype="notify" userlabel="Notification">
  <configuration>
    <notify disableEvent="true" enableUserLog="false">
      <notifyMessage>{1}</notifyMessage>
      <notifyMessageLevel>INFO|WARN|ERROR</notifyMessageLevel>
      <notifyParameters>
        <parametervalue valueType="current"/>
      </notifyParameters>
    </notify>
  </configuration>
</shape>
```

### Exception Shape
```xml
<shape shapetype="exception" userlabel="Exception">
  <configuration>
    <exception stopsingledoc="true">
      <exMessage>{1}</exMessage>
      <exParameters>
        <parametervalue valueType="track">
          <trackparameter propertyId="meta.base.applicationstatusmessage"/>
        </parametervalue>
      </exParameters>
    </exception>
  </configuration>
</shape>
```

---

## Generic XML Parsing Rules

| XML Pattern | What It Usually Means | How to Document |
|-------------|----------------------|-----------------|
| `*Id="uuid"` | Reference to another component | Note as "References: {uuid}" |
| `*Name="value"` | Human-readable identifier | Use as label |
| `*Type="value"` | Classification | Document the type |
| `valueType="..."` | Data source type | Document source |
| `<*parameter*>` | Configuration parameter | Extract key-value pairs |
| `key="n"` | Numeric reference | Note "Key {n} - resolve from profile" |
| `<dragpoint toShape="x">` | Flow connection | Use for sequence |
| `identifier="..."` | Branch path or return label | Document all paths |

---

## Unknown Element Handling

### Unknown Component Types
```xml
<bns:Component 
  type="{UNKNOWN_TYPE}"
  name="{ComponentName}"
  componentId="{uuid}"
  version="{n}"
  folderFullPath="{path}">
  <bns:description>{desc}</bns:description>
  <bns:object><!-- Extract structure --></bns:object>
</bns:Component>
```

### Unknown Shape Types
```xml
<shape 
  image="{icon}_icon"
  name="{shapeId}"
  shapetype="{UNKNOWN_TYPE}"
  userlabel="{UserLabel}">
  <configuration><!-- Extract all --></configuration>
  <dragpoints>
    <dragpoint toShape="{nextShape}" identifier="{pathId}"/>
  </dragpoints>
</shape>
```

Document unknown elements with ⚠️ flag and include full configuration for review.
