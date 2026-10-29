window.portfolioCase = {
  "summary": {
    "accession": "GSE52778",
    "analysis_status": "executed",
    "engine": "PyDESeq2",
    "engine_version": "0.5.4",
    "n_samples": 8,
    "n_donors": 4,
    "donors": [
      "N052611",
      "N061011",
      "N080611",
      "N61311"
    ],
    "conditions": [
      "untreated",
      "dexamethasone"
    ],
    "design": "~ donor + condition",
    "contrast": "dexamethasone vs untreated",
    "design_rank": 5,
    "residual_df": 3,
    "input_genes": 63677,
    "retained_genes": 16139,
    "prefilter_removed": 47538,
    "prefilter": ">= 10 counts in >= 4 samples",
    "wald_null": "log2 fold change = 0",
    "multiplicity": "Benjamini-Hochberg with independent filtering at alpha 0.05",
    "available_pvalues": 16139,
    "available_padj": 16139,
    "fdr_significant": 3881,
    "posthoc_selected": 957,
    "posthoc_effect_filter": "absolute unshrunken log2 fold change >= 1",
    "up": 493,
    "down": 464,
    "lfc_shrinkage": "none",
    "cooks_filter": true,
    "count_replacement": false,
    "small_sample_note": "Four paired donors; residual df=3. PyDESeq2 warns that dispersion-prior estimation is less stable at low residual degrees of freedom.",
    "pca": {
      "input": "design-informed VST, top 500 variable retained genes; no batch/donor removal",
      "PC1_percent": 48.10932940394944,
      "PC2_percent": 23.528220337596284
    },
    "CRISPLD2": {
      "ensembl_id": "ENSG00000103196",
      "annotation_source": "airway 1.32.0 gene_name, Ensembl 75",
      "log2FoldChange": 2.627133343875474,
      "padj": 1.4590500581404326e-60,
      "pvalue": 2.9833726946300437e-63,
      "lfcSE": 0.15648800912986496,
      "fold_change": 6.177972049345057
    },
    "python": "3.12.14",
    "versions": {
      "pydeseq2": "0.5.4",
      "rdata": "1.1.0",
      "numpy": "2.3.5",
      "pandas": "3.1.0",
      "scipy": "1.18.1",
      "scikit-learn": "1.8.0",
      "anndata": "0.13.4",
      "formulaic": "1.2.2",
      "matplotlib": "3.10.8"
    },
    "original_study": "Himes et al. 2014; doi:10.1371/journal.pone.0099625",
    "scope": "Independent public-data reanalysis; no clinical validation; not the user's original cohort"
  },
  "plots": {
    "pca": {
      "src": "assets/gse52778/gse52778_pca.svg",
      "kicker": "QUALITY CONTROL",
      "title": "The sample-level view",
      "alt": "PCA showing all eight airway RNA-seq samples, four donor pairs and their treatment responses.",
      "caption": "PCA of design-informed VST values for the 500 most variable retained genes. Each point is one sample; lines connect matched donors. Colors distinguish untreated and dexamethasone-treated cells. Donor variation is retained. PCA is descriptive QC."
    },
    "volcano": {
      "src": "assets/gse52778/gse52778_volcano.svg",
      "kicker": "DIFFERENTIAL EXPRESSION",
      "title": "A donor-adjusted expression landscape",
      "alt": "Volcano plot of 16,139 genes. 493 upregulated and 464 downregulated genes meet FDR below 0.05 and absolute log2 fold change at least 1.",
      "caption": "Dexamethasone versus untreated in a paired model (~ donor + condition), using PyDESeq2 0.5.4. The y-axis is -log10 BH-adjusted P. Colored genes satisfy BH FDR < 0.05 and an additional descriptive |unshrunken log2FC| >= 1 cutoff; the Wald test itself tests log2FC = 0."
    },
    "heatmap": {
      "src": "assets/gse52778/gse52778_heatmap.svg",
      "kicker": "EXPRESSION PATTERNS",
      "title": "Patterns across the matched samples",
      "alt": "Row-standardized VST expression heatmap for the 20 genes with the smallest adjusted P-values across all eight samples.",
      "caption": "The 20 genes with the smallest BH-adjusted P-values, ordered by average-linkage clustering of row-standardized VST expression. Columns preserve the same donor order in the two treatment groups. This display uses genes selected from the same dataset and is not external validation."
    },
    "paired": {
      "src": "assets/gse52778/gse52778_crispld2.svg",
      "kicker": "GENE-LEVEL RESPONSE",
      "title": "Following CRISPLD2 in each donor",
      "alt": "Paired normalized CRISPLD2 counts for each of four donors before and after dexamethasone treatment.",
      "caption": "All eight CRISPLD2 measurements displayed as size-factor-normalized counts, with lines connecting the four donor pairs. The reported effect and BH-adjusted P come from the genome-wide paired negative-binomial model, not a separate four-pair t-test. CRISPLD2 is a previously reported glucocorticoid-responsive gene in the original study."
    }
  }
};
